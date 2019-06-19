function games(parent, args, context, info) {
  const games = context.prisma.user({id: parent.id}).games()
  return games
}

module.exports = {
  games
}
