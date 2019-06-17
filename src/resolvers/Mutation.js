const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { APP_SECRET } = require("../utils.js")

async function signup(root, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)

  const user = context.prisma.createUser(
    {
      ...args,
      password,
    }
  )

  const token = jwt.sign({userId: user.id}, APP_SECRET)

  return {
    token,
    user
  }
}

async function login(root, args, context, info) {
  const user = await context.prisma.user({email: args.email})
  if(!user) {
    throw new Error('Invalid email')
  }

  const valid = bcrypt.compare(args.password, user.password)

  if(!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({userId: user.id}, APP_SECRET)
  return {
    token,
    user,
  }

}

module.exports = {
  signup,
  login,
}
