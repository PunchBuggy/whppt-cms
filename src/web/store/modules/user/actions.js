import api from '@/api';

export default {
  loadUsers({commit}) {
    return axios.get('/api/users').then(result => {
      commit('loadUsers', result.data)
    })
  },

  // loadUser({ commit }, { user }) {
    //   return axios.get(`/api/user/${user.id}`)
    //     .then(result => {
    //       commit('loadUser', result.data)
    //     })
    // },

  loadUserDetails({ commit }, id) {
    return axios.get(`/api/user`)
      .then(result => {
        commit('loadUserDetails', result.data)
      })
  },

  save({state}, id) {
    const user = state.list.find(user => user.id === id)
    return axios.post(`/api/user/${id}`, user)
  },
};
