const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const session = require('express-session')
const passport = require('passport')
const { EveOnlineSsoStrategy } = require('passport-eveonline-sso')
const bodyParser = require('body-parser')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // requestでjsonを扱えるように
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  // sessionの設定
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto'
    }
  }))

  // Passport.jsの設定
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new EveOnlineSsoStrategy(
      {
        clientID: EVEONLINE_CLIENT_ID,
        clientSecret: EVEONLINE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/eveonline',
        scope: ''
      },
      (accessToken, refreshToken, profile, cb) => {
        // We have a new authed session, you can now store and/or use the accessToken
        // and refreshToken to call EVE Swagger Interface (ESI) end points
        process.nextTick(() => {
          return done(null, profile)
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, {
      id: user.id,
      name: user.username,
    })
  })
  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })

  app.get('/auth/login', passport.authenticate('eveonline-sso'))

  app.get(
    '/auth/eveonline/callback',
    passport.authenticate('eveonline-sso', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.json({ user: req.user })
      res.redirect('/')
    }
  )

  app.get('/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
