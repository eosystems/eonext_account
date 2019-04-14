<template>
  <div>
    <h1>Home</h1>
    <p>id: {{ ($store.state.user || {}).id }}</p>
    <p>name: {{ ($store.state.user || {}).name }}</p>
    <p>loginToken: {{ ($store.state.user || {}).loginToken }}</p>

    <br>
    <a
      href="/api/auth/logout"
      class="button--green"
    >Logout</a>
  </div>
</template>

<script>
import EobaseClient from '~/utils/EobaseClient'
import Cookies from 'universal-cookie'

export default {
  async mounted() {
    const cookies = new Cookies()
    const loginToken = cookies.get('eobase-login-token')
    if (loginToken) {
      const client = new EobaseClient(loginToken)
      const res = await client.get('/users/1')
      const user = {
        id: res.data.data.attributes.character_id,
        name: res.data.data.attributes.name,
        loginToken: loginToken
      }
      this.$store.commit('login', user)
    } else {
      this.$router.push('/')
    }
  }
}
</script>
