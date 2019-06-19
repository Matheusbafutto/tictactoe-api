function player(parent, args, context, info) {
  const player = context.prisma.game({id: parent.id}).player()
  return player
}

module.exports = {
  player
}
