const Joi = require('joi')
const Account = require('models/Account')

exports.localRegister = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
  })

  const result = Joi.validate(ctx.request.body, schema)

  if (result.error) {
    ctx.status = 400
  }

  let account = null
  try {
    account = await Account.localRegister(ctx.request.body)
  } catch (e) {
    ctx.throw(500, e)
  }

  ctx.body = account.profile
}

exports.localLogin = async (ctx) => {
  ctx.body = 'login'
}

exports.exists = async (ctx) => {
  const { key, value } = ctx.params
  let account = null

  try {
    account = await (key === 'email' ? Account.findByEmail(value) : Account.findByUsername(value))
  } catch (e) {
    ctx.throw(500, e)
  }

  ctx.body = {
    exists: account !== null
  }
}

exports.logout = async (ctx) => {
  ctx.body = 'logout'
}
