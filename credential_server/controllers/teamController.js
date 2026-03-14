const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Team = require('../models/Team');
const Invite = require('../models/Invite');
const Task = require('../models/Task');
const Resource = require('../models/Resource');
const TeamMessage = require('../models/TeamMessage');
const User = require('../models/User');

// ─── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── createTeam ──────────────────────────────────────────────────────────────
exports.createTeam = async (req, res) => {
  try {
    const { name, projectIdea, description, requiredSkills, maxMembers } = req.body;
    const leaderId = req.user.id;

    const team = await Team.create({
      name,
      projectIdea,
      description,
      requiredSkills: requiredSkills || [],
      maxMembers: maxMembers || 5,
      leader: leaderId,
      members: [leaderId],
    });

    res.status(201).json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── inviteMember ─────────────────────────────────────────────────────────────
exports.inviteMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body;
    const leaderId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leader.toString() !== leaderId)
      return res.status(403).json({ message: 'Only the leader can invite members' });
    if (team.members.length >= team.maxMembers)
      return res.status(400).json({ message: 'Team is already full' });

    // Check if already a member
    const invitedUser = await User.findOne({ email: email.toLowerCase() });
    if (invitedUser && team.members.map(m => m.toString()).includes(invitedUser._id.toString()))
      return res.status(400).json({ message: 'User is already a team member' });

    // Check for existing pending invite
    const existingInvite = await Invite.findOne({ teamId, email: email.toLowerCase(), status: 'pending' });
    if (existingInvite)
      return res.status(400).json({ message: 'Invite already sent to this email' });

    const token = crypto.randomBytes(32).toString('hex');
    await Invite.create({ teamId, email: email.toLowerCase(), token });

    const inviteLink = `${process.env.CLIENT_URL}/invite/${token}`;

    await transporter.sendMail({
      from: `"TeamUP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `You're invited to join "${team.name}" on TeamUP`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: auto; padding: 32px; border-radius: 12px; border: 1px solid #e0e0e0;">
          <h2 style="color: #6c3de0;">You've been invited! 🚀</h2>
          <p>You have been invited to join <strong>${team.name}</strong> on <strong>TeamUP</strong>.</p>
          <p><strong>Project Idea:</strong> ${team.projectIdea}</p>
          <p>Click the button below to accept the invitation:</p>
          <a href="${inviteLink}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6c3de0,#a855f7);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">
            Accept Invite
          </a>
          <p style="margin-top:24px;color:#888;font-size:13px;">This link expires in 7 days.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Invite sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── acceptInvite ─────────────────────────────────────────────────────────────
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;

    const invite = await Invite.findOne({ token, status: 'pending' });
    if (!invite) return res.status(400).json({ message: 'Invalid or expired invitation' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure invite email matches logged-in user
    if (invite.email !== user.email.toLowerCase())
      return res.status(403).json({ message: 'This invitation is for a different email address' });

    const team = await Team.findById(invite.teamId);
    if (!team) return res.status(404).json({ message: 'Team no longer exists' });
    if (team.members.map(m => m.toString()).includes(userId))
      return res.status(400).json({ message: 'You are already a member of this team' });
    if (team.members.length >= team.maxMembers)
      return res.status(400).json({ message: 'Team is full' });

    team.members.push(userId);
    await team.save();

    invite.status = 'accepted';
    await invite.save();

    res.json({ success: true, teamId: team._id, message: 'You have joined the team!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── getInviteInfo (public – for invite page before login) ────────────────────
exports.getInviteInfo = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token }).populate('teamId', 'name projectIdea');
    if (!invite || invite.status !== 'pending')
      return res.status(400).json({ message: 'Invalid or expired invitation' });

    res.json({ success: true, invite });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── getTeamWorkspace ─────────────────────────────────────────────────────────
exports.getTeamWorkspace = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId)
      .populate('leader', 'fullName email')
      .populate('members', 'fullName email skills');

    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.some(m => m._id.toString() === userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied. You are not a member.' });

    const tasks = await Task.find({ teamId })
      .populate('assignedTo', 'fullName')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    const resources = await Resource.find({ teamId })
      .populate('addedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json({ success: true, team, tasks, resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── getUserTeams ─────────────────────────────────────────────────────────────
exports.getUserTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await Team.find({ members: userId })
      .populate('leader', 'fullName')
      .sort({ createdAt: -1 });
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── addTask ──────────────────────────────────────────────────────────────────
exports.addTask = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, assignedTo } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.map(m => m.toString()).includes(userId);
    if (!isMember) return res.status(403).json({ message: 'Not a team member' });

    const task = await Task.create({
      teamId,
      title,
      assignedTo: assignedTo || null,
      createdBy: userId,
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'fullName' },
      { path: 'createdBy', select: 'fullName' },
    ]);

    res.status(201).json({ success: true, task: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── updateTaskStatus ─────────────────────────────────────────────────────────
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    ).populate('assignedTo', 'fullName').populate('createdBy', 'fullName');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── addResource ──────────────────────────────────────────────────────────────
exports.addResource = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, url } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.map(m => m.toString()).includes(userId);
    if (!isMember) return res.status(403).json({ message: 'Not a team member' });

    const resource = await Resource.create({ teamId, title, url, addedBy: userId });
    const populated = await resource.populate('addedBy', 'fullName');

    res.status(201).json({ success: true, resource: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── sendMessage ──────────────────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.map(m => m.toString()).includes(userId);
    if (!isMember) return res.status(403).json({ message: 'Not a team member' });

    const msg = await TeamMessage.create({ teamId, senderId: userId, message });
    const populated = await msg.populate('senderId', 'fullName');

    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── getMessages ──────────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.map(m => m.toString()).includes(userId);
    if (!isMember) return res.status(403).json({ message: 'Not a team member' });

    const messages = await TeamMessage.find({ teamId })
      .populate('senderId', 'fullName')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── removeMember ─────────────────────────────────────────────────────────────
exports.removeMember = async (req, res) => {
  try {
    const { teamId, userId: targetId } = req.params;
    const leaderId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leader.toString() !== leaderId)
      return res.status(403).json({ message: 'Only the leader can remove members' });
    if (targetId === leaderId)
      return res.status(400).json({ message: 'Leader cannot remove themselves. Transfer leadership first.' });

    team.members = team.members.filter(m => m.toString() !== targetId);
    await team.save();

    res.json({ success: true, message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── leaveTeam ────────────────────────────────────────────────────────────────
exports.leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leader.toString() === userId)
      return res.status(400).json({ message: 'Leader cannot leave. Transfer leadership or delete the team.' });

    team.members = team.members.filter(m => m.toString() !== userId);
    await team.save();

    res.json({ success: true, message: 'You have left the team' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── completeProject ──────────────────────────────────────────────────────────
exports.completeProject = async (req, res) => {
  try {
    const { teamId } = req.params;
    const leaderId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leader.toString() !== leaderId)
      return res.status(403).json({ message: 'Only the leader can mark the project complete' });

    team.status = 'completed';
    await team.save();

    res.json({ success: true, message: 'Project marked as completed!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
