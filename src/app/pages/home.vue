<template>
  <div>
    <h1>Home</h1>
    <p>id: {{ $store.state.user.id }}</p>
    <p>name: {{ $store.state.user.name }}</p>
    <p>accessToken: {{ $store.state.user.accessToken }}</p>
    <p>refreshToken: {{ $store.state.user.refreshToken }}</p>

    <br>
    <a
      href="/api/auth/logout"
      class="button--green"
    >Logout</a>
  </div>
</template>

<script>
export default {
  fetch({ store, redirect }) {
    // 未認証の場合、リダイレクトする
    if (!store.state.auth) {
      return redirect('/')
    }
  }
}
</script>
