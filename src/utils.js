const jwt = require('jsonwebtoken')

APP_SECRET = "my-secret"

function getUserId(context) {
  const authorization = context.request.get('Authorization')
  if(authorization) {
    const token = authorization.replace("Bearer ", "")
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }
  throw new Error("Not authorized")
}

module.exports = {
  APP_SECRET,
  getUserId,
}
