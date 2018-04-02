import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { formatError } from 'apollo-errors'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import bodyParser from 'body-parser'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ObjectId } from 'mongodb'
import nodeify from 'nodeify'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'

import config from './config'
import seed from './config/seed'
import schema from './app/schema'
import { configureModels } from './app/models'
import { subscriptionManager } from './app/subscription'
import { AuthRequired } from './app/errors/auth'

const start = async () => {

  // DB Connection
  const mongo = await MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)

  // Add models to context
  const models = configureModels({ db: mongo })

  // Seed database
  seed(models)

  // Server configuration
  const app = express()

  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(passport.initialize())

  // Authentication config
  const userFromPayload = async (jwtPayload) => {
    if (!jwtPayload.userId) {
      throw new Error('No userId in JWT')
    }
    return await models.User.findOneById(ObjectId(jwtPayload.userId))
  }
  passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.app.jwt,
    passReqToCallback: true,
  }, (request, jwtPayload, done) => nodeify(userFromPayload(jwtPayload), done)
  ))

  // Routing
  // Authentication
  app.post('/signin', async (req, res, next) => {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).send({ msg: 'Missing parameters' })
      }
      const user = await models.User.collection.findOne({ username })
      if (!user || !(await bcrypt.compare(password, user.hash))) {
        return res.status(404).send({ msg: 'User not found' })
      }
      res.status(200).send({ token: jwt.encode({ userId: user._id, username: user.username, roles: user.roles }, config.app.jwt) })
    } catch (e) {
      next(e)
    }
  })

  app.post('/signup', async (req, res, next) => {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).send({ msg: 'Missing parameters' })
      }
      const exists = await models.User.collection.findOne({ username })
      if (exists) {
        return res.status(404).send({ msg: 'User already exists' })
      }
      const user = await models.User.insert({ username, password })
      res.status(200).send({ token: jwt.encode({ userId: user._id, username: user.username, roles: user.roles }, config.app.jwt) })
    } catch (e) {
      next(e)
    }
  })

  // GraphQL 
  app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      graphqlExpress(() => {
        const query = req.query.query || req.body.query
        if (query && query.length > 2000) {
          throw new Error('Query too large.')
        }
        return {
          schema,
          context: { ...models, user }, // add current user to context
          debug: config.dev,
          formatError,
        }
      })(req, res, next)
    })(req, res, next)
  })

  // GraphiQL
  if (config.dev) {
    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: `ws://${config.app.host}:${config.app.port}/subscriptions`
    }))
  }

  app.listen(config.app.port, () =>
    console.log(`✨ ✨ GraphQL Server is now running on http://${config.app.host}:${config.app.port} ✨ ✨`)
  )

  // WebSocket server for subscriptions
  const wsServer = createServer((req, res) => {
    res.writeHead(404)
    res.end()
  })

  wsServer.listen(config.app.ws, () =>
    console.log(`✨ ✨ GraphQL WS Server is now running on ws://${config.app.host}:${config.app.ws}/subscriptions ✨ ✨`)
  )

  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
      server: wsServer,
      path: '/subscriptions',
    }
  )
}

// Finally starts server
start()
  .then(() => {
    console.log('✨ ✨ Everything\'s going on ✨ ✨')
  })
  .catch((e) => {
    console.error('Uncaught error in startup')
    console.error(e)
    console.trace(e)
  })
