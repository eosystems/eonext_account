<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        eonext_account
      </h1>
      <h2 class="subtitle">
        eonext account frontend
      </h2>
      <div class="links">
        <a
          href="/api/auth/eveonline"
          target="_blank"
          class="button--green"
        >Login</a>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  async mounted() {
    const data = JSON.stringify({
      body: 'aaa'
    })
    this.$axios.get('/me/api/hello').then((res) => { return res })
    this.$axios.get('/base/users/1').then((res) => { return res })
    this.$axios.post('//docker.for.mac.localhost:3001/login', data)
    this.$axios.post('/base2/login', data)
    this.$axios.post('/base3/login', data)

    const res = await this.$axios.post('/base/login.json', data, {
      headers: {
        'content-type': 'application/json'
      },
      responseType: 'json'
    })
      .catch((error) => {
        console.log(error)
      })

    console.log(res)
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
