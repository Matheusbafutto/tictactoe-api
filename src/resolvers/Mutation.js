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

function inInterval(num, begin, end, begInclusive=true, endInclusive=true) {
  let isIn = begInclusive ? num >= begin : num > begin
  isIn = isIn && (endInclusive ? num <= end : num < end)
  return isIn
}

function hasGameFinished(state) {
  let winCond = new Set(["dx","do","ax","ao","ro0","ro1","ro2","rx0","rx1","rx2","co0","co1","co2","cx0","cx1","cx2"])
  let stillHasPlay = false
  for(let i=0; i < 9; i++) {
    let row = Math.floor(i/3)
    let col = i%3
    const diag = row === col
    const anti = (row === 1 && col === 1) || (row === 2 && col === 0) || (row === 0 && col === 2)
    if(state[i] === '#') { stillHasPlay = true }

    if(diag) {
      if(state[i] === '#' || state[i] === 'x') { winCond.delete('do') }
      if(state[i] === '#' || state[i] === 'o') { winCond.delete('dx') }
    }
    if(anti) {
      if(state[i] === '#' || state[i] === 'x') { winCond.delete('ao') }
      if(state[i] === '#' || state[i] === 'o') { winCond.delete('ax') }
    }
    if(state[i] === '#' || state[i] === 'o') { winCond.delete(`rx${row}`) }
    if(state[i] === '#' || state[i] === 'x') { winCond.delete(`ro${row}`) }

    if(state[i] === '#' || state[i] === 'o') { winCond.delete(`cx${col}`) }
    if(state[i] === '#' || state[i] === 'x') { winCond.delete(`co${col}`) }
  }
  let finished = null
  let won = null
  if(winCond.size === 0) {
    finished = stillHasPlay ? false : true
    won = null
  } else if(winCond.size === 1) {
    finished = true
    won = winCond.values().next().value[1] === 'o' ? true : false
  } else {
    throw new Error('Multiple win conditions detected')
  }

  return {
    finished,
    won,
  }
}

async function play(root, args, context, info) {

  const {row, col, gameId} = args
  if(!gameId) {
    throw new Error("Game not found")
  }

  const game = await context.prisma.game({id: gameId})
  const userId = getUserId(context)
  const user = await context.prisma.game({id: gameId}).player()
  if(user.id != userId) {
    throw new Error("Not authorized")
  }
  if(game.finished) {
    throw new Error("Game is finished")
  }

  let state = game.state.split('')
  const cell = row*3 + col
  if(!inInterval(row,0,2) || !inInterval(col,0,2) || state[cell] === 'x') {
    throw new Error("Invalid Move")
  }

  state[cell] = 'o'
  let {finished, won} = hasGameFinished(state)

  let emptySlots = []
  for(let i = 0; i < state.length; i++) {
    if(state[i] === '#') {
      emptySlots.push(i)
    }
  }
  const choice = emptySlots.length > 0 ? emptySlots[Math.floor(Math.random()*emptySlots.length)] : null
  if(choice !== null) {
    state[choice] = 'x'
    object = hasGameFinished(state)
    finished = object.finished
    won = object.won
  }

  state = state.join('')
  return context.prisma.updateGame({
    where: { id: game.id },
    data: {
      state,
      finished,
      won,
    }
  })

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
