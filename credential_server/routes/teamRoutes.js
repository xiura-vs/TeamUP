const express = require('express');
const router = express.Router();
const { authMiddleware: auth } = require('../controllers/authController');
const {
  createTeam,
  inviteMember,
  acceptInvite,
  getInviteInfo,
  getTeamWorkspace,
  getUserTeams,
  addTask,
  updateTaskStatus,
  addResource,
  sendMessage,
  getMessages,
  removeMember,
  leaveTeam,
  completeProject,
} = require('../controllers/teamController');

// Teams
router.post('/', auth, createTeam);
router.get('/my', auth, getUserTeams);
router.get('/:teamId', auth, getTeamWorkspace);
router.patch('/:teamId/complete', auth, completeProject);

// Invites
router.post('/:teamId/invite', auth, inviteMember);
router.get('/invite/:token', getInviteInfo);          // public – show invite info
router.post('/invite/:token/accept', auth, acceptInvite); // protected – must be logged in

// Tasks
router.post('/:teamId/tasks', auth, addTask);
router.patch('/tasks/:taskId', auth, updateTaskStatus);

// Resources
router.post('/:teamId/resources', auth, addResource);

// Messages
router.post('/:teamId/messages', auth, sendMessage);
router.get('/:teamId/messages', auth, getMessages);

// Members
router.delete('/:teamId/member/:userId', auth, removeMember);
router.post('/:teamId/leave', auth, leaveTeam);

module.exports = router;
