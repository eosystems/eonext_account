<template>
  <p>callback</p>
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  async mounted() {
    const res = await this.$axios.get('/api/auth/callback', {
      params: this.$route.query
    })
    const user = {
      id: res.data.user.id,
      name: res.data.user.username
    }
    this.$store.commit('login', user)
    this.$router.push('/home')
  }
}
</script>
