const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const session = require('express-session')
const passport = require('passport')
const EveOnlineSsoStrategy = require('passport-eveonline-sso')
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

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)
}

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
      clientID: process.env.EVEONLINE_CLIENT_ID,
      clientSecret: process.env.EVEONLINE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/callback',
      scope: 'publicData esi-calendar.respond_calendar_events.v1 esi-calendar.read_calendar_events.v1 esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-mail.organize_mail.v1 esi-mail.read_mail.v1 esi-mail.send_mail.v1 esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-wallet.read_corporation_wallet.v1 esi-search.search_structures.v1 esi-clones.read_clones.v1 esi-characters.read_contacts.v1 esi-universe.read_structures.v1 esi-bookmarks.read_character_bookmarks.v1 esi-killmails.read_killmails.v1 esi-corporations.read_corporation_membership.v1 esi-assets.read_assets.v1 esi-planets.manage_planets.v1 esi-fleets.read_fleet.v1 esi-fleets.write_fleet.v1 esi-ui.open_window.v1 esi-ui.write_waypoint.v1 esi-characters.write_contacts.v1 esi-fittings.read_fittings.v1 esi-fittings.write_fittings.v1 esi-markets.structure_markets.v1 esi-corporations.read_structures.v1 esi-characters.read_loyalty.v1 esi-characters.read_opportunities.v1 esi-characters.read_chat_channels.v1 esi-characters.read_medals.v1 esi-characters.read_standings.v1 esi-characters.read_agents_research.v1 esi-industry.read_character_jobs.v1 esi-markets.read_character_orders.v1 esi-characters.read_blueprints.v1 esi-characters.read_corporation_roles.v1 esi-location.read_online.v1 esi-contracts.read_character_contracts.v1 esi-clones.read_implants.v1 esi-characters.read_fatigue.v1 esi-killmails.read_corporation_killmails.v1 esi-corporations.track_members.v1 esi-wallet.read_corporation_wallets.v1 esi-characters.read_notifications.v1 esi-corporations.read_divisions.v1 esi-corporations.read_contacts.v1 esi-assets.read_corporation_assets.v1 esi-corporations.read_titles.v1 esi-corporations.read_blueprints.v1 esi-bookmarks.read_corporation_bookmarks.v1 esi-contracts.read_corporation_contracts.v1 esi-corporations.read_standings.v1 esi-corporations.read_starbases.v1 esi-industry.read_corporation_jobs.v1 esi-markets.read_corporation_orders.v1 esi-corporations.read_container_logs.v1 esi-industry.read_character_mining.v1 esi-industry.read_corporation_mining.v1 esi-planets.read_customs_offices.v1 esi-corporations.read_facilities.v1 esi-corporations.read_medals.v1 esi-characters.read_titles.v1 esi-alliances.read_contacts.v1 esi-characters.read_fw_stats.v1 esi-corporations.read_fw_stats.v1 esi-characterstats.read.v1'
    },
    (accessToken, refreshToken, profile, done) => {
      // We have a new authed session, you can now store and/or use the accessToken
      // and refreshToken to call EVE Swagger Interface (ESI) end points
      process.nextTick(() => {
        return done(null, { accessToken, refreshToken, profile })
      })
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    name: user.username
  })
})
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.get('/hello', (req, res) => res.send('world'))
app.get('/auth/eveonline', passport.authenticate('eveonline-sso'))
app.get(
  '/auth/callback',
  passport.authenticate('eveonline-sso', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.json({ user: req.user })
  }
)
app.get('/auth/eveonline/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

start()

module.exports = {
  path: '/api',
  handler: app
}
