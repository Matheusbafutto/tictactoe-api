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

module.exports = {
  hello,
  user,
}
