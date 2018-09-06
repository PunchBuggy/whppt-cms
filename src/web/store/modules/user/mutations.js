import router from '@/router';
import auth from '@/auth';

export default {
  loadUsers(state, result) {
    state.list = result
  },

  // loadUser(state, user) {
  //   state.user = user;
  //   router.push(`/user/${user.id}`);
  // },

  loadUserDetails(state, user) {
    state.user = user;
  }
};
