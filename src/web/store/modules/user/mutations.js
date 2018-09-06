import router from '@/router';
import auth from '@/auth';

export default {
  loadUsers(state, result) {
    state.list = result
  },

  setPermission(state, payload) {
    const user = state.list.find(user => user.id === payload.user.id)
    if (!user) { return }

    let project = user.projects.find(project => project.id === payload.project.id)
    if (!project) {
      project = {
        ...payload.project,
        permissions: [],
      }
      user.projects.push(project)
    }

    if (payload.value) {
      project.permissions.push(payload.role)
    } else {
      const index = project.permissions.indexOf(payload.role)
      if (index > -1) {
        project.permissions.splice(index, 1)
      }
    }

    if (!project.permissions.length) {
      user.projects = user.projects.filter(proj => proj.id !== project.id)
    }
  },

  // loadUser(state, user) {
  //   state.user = user;
  //   router.push(`/user/${user.id}`);
  // },

  loadUserDetails(state, user) {
    state.user = user;
  }
};
