<template>
<div class="main">
  <app-nav></app-nav>
  <div v-for="user in list" :key="user.id" class="container">
    {{ user }}
    <h4>{{ user.email || user.id }}</h4>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th v-for="role in roles" :key="role" scope="col">
            {{ role }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in user.projects" :key="project.id">
          <th scope="row">{{ project.name }}</th>
          <td v-for="role in roles" :key="role">
            <input
              type="checkbox"
              :id="user.id + '|' + project.id + '|' + role"
              :checked="project.permissions.includes(role)"
              @change="setPermission({
                user: user.id,
                project: project.id,
                role,
                value: $event.target.checked
              })"
            >
            <label :for="user.id + '|' + project.id + '|' + role"></label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import appNav from '@/components/nav'

export default {
  name: 'permissions',
  components: {
    appNav,
  },
  data: () => ({
    roles: [
      'read',
      'edit',
      'own',
      'admin',
    ]
  }),
  created() {
    this.loadUsers()
  },
  methods: {
    ...Vuex.mapActions('user', ['loadUsers']),
    ...Vuex.mapMutations('user', ['setPermission']),
  },
  computed: Vuex.mapState('user', ['list'])
}
</script>

<style lang="scss" scoped>
.main {
  padding-top: 100px;
}
</style>
