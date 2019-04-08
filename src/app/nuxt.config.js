const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    proxy: true,
    debug: true,
    requestInterceptor: (config, { store }) => {
      config.headers.common.Authorization = ''
      config.headers.common['Content-Type'] = 'application/json'
      return config
    }
  },
  proxy: {
    '/base/': { target: 'http://docker.for.mac.localhost:3001', pathRewrite: { '^/base': '' }},
    '/base2/': { target: 'http://0.0.0.0:3001', pathRewrite: { '^/base2': '' }},
    '/base3/': { target: 'http://host.docker.internal:3001', pathRewrite: { '^/base3': '' }},
    '/me/': { target: 'http://docker.for.mac.localhost:4000', pathRewrite: { '^/me/': '' }},
    '/api/': 'http://docker.for.mac.localhost:4000'
  },
  serverMiddleware: [
    '~/server'
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
