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
    await this.$axios.post('http//:localhost:3001/login')
    const res = await this.$axios.get('/api/auth/callback', {
      params: this.$route.query
    })

    const user = {
      id: res.data.user.profile.CharacterID,
      name: res.data.user.profile.CharacterName,
      accessToken: res.data.user.accessToken,
      refreshToken: res.data.user.refreshToken,
      data: res.data.user
    }
    this.$store.commit('login', user)
    this.$router.push('/home')
  }
}
</script>
