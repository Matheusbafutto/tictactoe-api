const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { APP_SECRET, getUserId } = require("../utils.js")

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

function play(root, args, context, info) {
  const {row, col, gameId} = args
  return
}


function startGame(root, args, context, info) {
  const userId = getUserId(context)
  const game = context.prisma.createGame({
    player: { connect: { id: userId } },
    state: '#########',
  })
  return game
}

module.exports = {
  signup,
  login,
  play,
  startGame,
}
