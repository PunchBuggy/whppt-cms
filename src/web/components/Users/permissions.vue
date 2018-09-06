<template>
<div class="main">
  <app-nav></app-nav>
  <div v-for="user in list" :key="user.id">
    {{ user }}
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
  created() {
    this.loadUsers()
  },
  methods: Vuex.mapActions('user', ['loadUsers']),
  computed: Vuex.mapState('user', ['list'])
}
</script>

<style lang="scss" scoped>
.main {
  padding-top: 100px;
}
</style>
