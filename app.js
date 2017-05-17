const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

const api = require('./routes/api')
const pic = require('./routes/pic')
const wx = require('./routes/wx')

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
//app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/app', api.routes(), api.allowedMethods())
router.use('/upload', pic.routes(), pic.allowedMethods())
router.use('/wx', wx.routes(), wx.allowedMethods())

app.use(router.routes(), router.allowedMethods())
// response

app.on('error', function (err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx);
})

module.exports = app