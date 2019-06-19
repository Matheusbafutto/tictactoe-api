const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const User = require('./resolvers/User')
const Game = require('./resolvers/Game')

const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query,
  Mutation,
  User,
  Game,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  context: request => {
    return {
      prisma,
      ...request,
    }
  },
  resolvers,
})
server.start(() => console.log('Server is running on localhost:4000'))
