<template>
<div class="main">
  <app-nav></app-nav>
  <div v-for="user in userList" :key="user.id" class="container">
    {{ user }}
    <h4>
      {{ user.email || user.id }}
      <button @click="save(user.id)">Save</button>
    </h4>
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
        <tr v-for="project in projectList" :key="project.id">
          <th scope="row">{{ project.name }}</th>
          <td v-for="role in roles" :key="role">
            <input
              type="checkbox"
              :id="user.id + '|' + project.id + '|' + role"
              :checked="userHasRole(user, project, role)"
              @change="setPermission({
                user,
                project,
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
    this.loadProjects()
  },
  methods: {
    ...Vuex.mapActions('user', ['loadUsers', 'save']),
    ...Vuex.mapActions('project', ['loadProjects']),
    ...Vuex.mapMutations('user', ['setPermission']),

    userHasRole(user, project, role) {
      const userProject = user.projects.find(p => p.id === project.id)
      if (!userProject) {
        return false
      }
      return userProject.permissions.includes(role)
    },
  },
  computed: {
   ...Vuex.mapState('user', {userList: 'list'}),
   ...Vuex.mapState('project', {projectList: 'list'}),
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding-top: 100px;
}
</style>
