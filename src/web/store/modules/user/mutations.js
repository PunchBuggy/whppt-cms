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
        typePermissions: {}
      }
      user.projects.push(project)
    }

    let permissions = project.permissions
    if (payload.type) {
      if (!project.typePermissions) {
        Vue.set(project, 'typePermissions', {})
      }

      permissions = project.typePermissions[payload.type.id]

      if (!permissions) {
        permissions = []
        Vue.set(project.typePermissions, payload.type.id, permissions)
      }
    }

    if (payload.value) {
      permissions.push(payload.role)
    } else {
      const index = permissions.indexOf(payload.role)
      if (index > -1) {
        permissions.splice(index, 1)
      }
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
