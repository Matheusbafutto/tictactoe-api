const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const User = require('./resolvers/User')

const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query,
  Mutation,
  User,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  context: {
    prisma
  },
  resolvers,
})
server.start(() => console.log('Server is running on localhost:4000'))
