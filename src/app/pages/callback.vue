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
    await this.$axios.post('/base/login', {
      login: {
        access_token: res.data.user.accessToken,
        refresh_token: res.data.user.refreshToken
      }
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
