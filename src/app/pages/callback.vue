<template>
  <p>callback</p>
</template>

<script>
import EobaseClient from '~/utils/EobaseClient'
import Cookies from 'universal-cookie'

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
    const client = new EobaseClient()
    const res2 = await client.post('/login', {
      access_token: res.data.user.accessToken,
      refresh_token: res.data.user.refreshToken
    })
    const user = {
      id: res.data.user.profile.CharacterID,
      name: res.data.user.profile.CharacterName,
      accessToken: res.data.user.accessToken,
      refreshToken: res.data.user.refreshToken,
      loginToken: res2.data.data.attributes.login_token,
      data: res.data.user
    }

    // cookieにログイン情報を保存
    const cookies = new Cookies()
    cookies.set('eobase-login-token', user.loginToken, { maxAge: 90 })
    this.$store.commit('login', user)
    this.$router.push('/home')
  }
}
</script>
