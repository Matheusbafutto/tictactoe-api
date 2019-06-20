const { getUserId } = require('../utils')

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

function finishedGames(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.user({id: userId}).games({where: {finished: true}})
}

function unfinishedGames(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.user({id: userId}).games({where: {finished: false}})
}

function wonGames(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.user({id: userId}).games({where: {won: true}})
}

function drawGames(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.user({id: userId}).games({where: {won: null, finished:true}})
}

function lostGames(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.user({id: userId}).games({where: {won: false}})
}

module.exports = {
  hello,
  user,
  finishedGames,
  unfinishedGames,
  wonGames,
  lostGames,
  drawGames,
}
