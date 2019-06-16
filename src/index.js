const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello: String!
    user(id: ID!): User!
  }

  type Mutation {
    signup(name: String!, email:String!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`

users = []
count = 0

const resolvers = {
  Query: {
    hello: () => `hello world`,
    user: (parent, args) => {
      id = args.id
      result = users.filter(user => user.id === id)
      if(result.length < 1) throw new Error("User not found")
      return result[0]
    }
  },
  Mutation: {
    signup: (root, args, context, info) => {
      const user = {
        id: `user-${count}`,
        name: args.name,
        email: args.email,
      }
      users.push(user)
      count += 1
      return user
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})
server.start(() => console.log('Server is running on localhost:4000'))
