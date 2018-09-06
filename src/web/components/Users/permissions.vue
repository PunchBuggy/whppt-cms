<template>
<div class="main">
  <app-nav></app-nav>
  <div v-for="user in userList" :key="user.id" class="container">
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
        <template v-for="project in projectList">
          <!-- Main project perms -->
          <tr :key="project.id">
            <th
              scope="row"
              @click="loadProject(project.id)"
            >
              {{ project.name }}
            </th>
            <td v-for="role in roles" :key="role">
              <input
                type="checkbox" class="filled-in"
                :id="[user.id, project.id, role].join('|')"
                :checked="userHasRole(user, {project}, role)"
                @change="setPermission({
                  user,
                  project,
                  role,
                  value: $event.target.checked
                })"
              >
              <label :for="[user.id, project.id, role].join('|')"></label>
            </td>
          </tr>
          <!-- Child types -->
          <template v-if="project.id === selectedProject.id">
            <tr
              v-for="type in selectedProject.types"
              :key="project.id + '|' + type.id"
              class="type-row"
            >
              <th scope="row">{{ type.label.singular }}</th>
              <td v-for="role in roles" :key="role">
                <input
                  type="checkbox" class="filled-in"
                  :id="[user.id, project.id, type.id, role].join('|')"
                  :checked="
                    userHasRole(user, {project}, role) ||
                    userHasRole(user, {project, type}, role)
                  "
                  :disabled="userHasRole(user, {project}, role)"
                  @change="setPermission({
                    user,
                    project,
                    type,
                    role,
                    value: $event.target.checked
                  })"
                >
                <label :for="[user.id, project.id, type.id, role].join('|')"></label>
              </td>
            </tr>
          </template>
        </template>
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
    ...Vuex.mapActions('project', ['loadProjects', 'loadProject']),
    ...Vuex.mapMutations('user', ['setPermission']),

    userHasRole(user, {project, type}, role) {
      const userProject = user.projects.find(p => p.id === project.id)
      if (!userProject) {
        return false
      }

      if (!type) {
        return userProject.permissions.includes(role)
      }

      const typePermissions = userProject.typePermissions
      return typePermissions && typePermissions[type.id] && typePermissions[type.id].includes(role)
    },
  },
  computed: {
    ...Vuex.mapState('user', {userList: 'list'}),
    ...Vuex.mapState('project', {
      projectList: 'list',
      selectedProject: 'project',
    }),
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding-top: 100px;
}

.type-row th {
  padding-left: 2em;
}
</style>
