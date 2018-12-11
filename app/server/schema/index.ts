import { ApolloServer, Config } from 'apollo-server-express'
import * as express from 'express'
import * as mongoose from 'mongoose'

import resolvers from './resolvers'
import typeDefs, { Context } from './types'

const router = express.Router()

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString()
}

module.exports = ({ app, cache, dev = false }) => {
  const options: Config & { context: Context } = {
    typeDefs,
    resolvers,
    context: { cache },
    introspection: dev,
    playground: dev,
    tracing: dev,
    cacheControl: true
  }

  try {
    if (process.env.MONGO_URL) {
      ;(async () => {
        const db = await mongoose.connect(
          process.env.MONGO_URL,
          {
            dbName: 'datasets',
            useNewUrlParser: true
          }
        )

        options.context.mongo = db.connection
      })()
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  new ApolloServer(options).applyMiddleware({ app })

  return router
}
