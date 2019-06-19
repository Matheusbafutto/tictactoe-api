function hello() {
  return `hello world`
}
function user(parent, args, context, info) {
  id = args.id
  const user = context.prisma.user({
    id
  })
  return user
}

function allGames() {
  return
}

function finishedGames() {
  return
}

function unfinishedGames() {
  return
}

function gamesWon() {
  return
}

function gamesLost() {
  return
}

module.exports = {
  hello,
  user,
  allGames,
  finishedGames,
  unfinishedGames,
  gamesWon,
  gamesLost,
}
