import axios from 'axios';

const api = axios.create({
  baseURL: 'https://teamup-jdzz.onrender.com/api',
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Hackathons ───────────────────────────────────────────────────────────────
export const getHackathons = () => api.get('/hackathons');

// ─── Teams ────────────────────────────────────────────────────────────────────
export const createTeam = (data) => api.post('/teams', data);
export const getUserTeams = () => api.get('/teams/my');
export const getTeamWorkspace = (teamId) => api.get(`/teams/${teamId}`);
export const completeProject = (teamId) => api.patch(`/teams/${teamId}/complete`);

// ─── Invites ──────────────────────────────────────────────────────────────────
export const inviteMember = (teamId, email) => api.post(`/teams/${teamId}/invite`, { email });
export const getInviteInfo = (token) => api.get(`/teams/invite/${token}`);
export const acceptInvite = (token) => api.post(`/teams/invite/${token}/accept`);

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const addTask = (teamId, data) => api.post(`/teams/${teamId}/tasks`, data);
export const updateTask = (taskId, data) => api.patch(`/teams/tasks/${taskId}`, data);

// ─── Resources ────────────────────────────────────────────────────────────────
export const addResource = (teamId, data) => api.post(`/teams/${teamId}/resources`, data);

// ─── Messages ─────────────────────────────────────────────────────────────────
export const sendMessage = (teamId, message) => api.post(`/teams/${teamId}/messages`, { message });
export const getMessages = (teamId) => api.get(`/teams/${teamId}/messages`);

// ─── Members ──────────────────────────────────────────────────────────────────
export const removeMember = (teamId, userId) => api.delete(`/teams/${teamId}/member/${userId}`);
export const leaveTeam = (teamId) => api.post(`/teams/${teamId}/leave`);

export default api;
