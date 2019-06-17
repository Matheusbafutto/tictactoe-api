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

module.exports = {
  signup
}
