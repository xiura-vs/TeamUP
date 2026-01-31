const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { extractFromDescription } = require("../utils/gemini");

const normalize = (s = "") => s.toLowerCase();

const SKILL_ALIASES = {
  js: "javascript",
  javascript: "javascript",
  reactjs: "react",
  nodejs: "node",
  html5: "html",
  css3: "css",
};

const normalizeSkill = (s = "") => {
  const key = s.toLowerCase();
  return SKILL_ALIASES[key] || key;
};

exports.matchTeammates = async (req, res) => {
  try {
    const { projectDescription = "", requiredSkills = [] } = req.body;

    if (!projectDescription && requiredSkills.length === 0) {
      return res.status(400).json({
        message: "Project description or skills required",
      });
    }

    let ai;
    try {
      ai = await extractFromDescription(projectDescription);
    } catch {
      console.warn("Gemini failed — fallback logic used");
      ai = {
        projectType: "general",
        coreSkills: [],
        secondarySkills: [],
        summary: "",
      };
    }

    const inputSkills = [
      ...new Set(
        [
          ...requiredSkills.flatMap((s) =>
            s.split(",").map((x) => normalizeSkill(x.trim())),
          ),
          ...(ai.coreSkills || []).map(normalizeSkill),
          ...(ai.secondarySkills || []).map(normalizeSkill),
        ].filter(Boolean),
      ),
    ];

    const users = await User.find({});

    const matches = users
      .map((user) => {
        let score = 0;
        let reasons = [];

        const userSkills = user.skills.map(normalizeSkill);
        const bio = normalize(user.bio || "");

        inputSkills.forEach((skill) => {
          if (userSkills.includes(skill)) {
            score += 40;
            reasons.push(`Has skill ${skill}`);
          } else if (bio.includes(skill)) {
            score += 20;
            reasons.push(`Mentions ${skill} in bio`);
          }
        });

        if (score === 0) return null;

        (ai.coreSkills || []).forEach((skill) => {
          if (bio.includes(skill)) {
            score += 20;
            reasons.push(`Experience with ${skill}`);
          }
        });

        if (
          ai.projectType !== "general" &&
          userSkills.some((s) => bio.includes(s))
        ) {
          score += 15;
          reasons.push(`Fits project intent (${ai.projectType})`);
        }

        const maxScore = inputSkills.length * 40 + 35;
        const percentage = Math.min(Math.round((score / maxScore) * 100), 100);

        return {
          user: {
            id: user._id,
            fullName: user.fullName,
            bio: user.bio,
            skills: user.skills,
            college: user.college,
          },
          score: percentage,
          reasons,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    res.json({
      projectSummary: ai.summary,
      matchedTeammates: matches,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Matching failed" });
  }
};

module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
