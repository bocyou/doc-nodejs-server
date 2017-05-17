const router = require('koa-router')()
const login = require('./api/login')
const sign = require('./api/sign')
const index = require('./api/index')
const findexpert = require('./api/findexpert')
const servicelist = require('./api/servicelist')
const servicetotal = require('./api/servicetotal')
const service = require('./api/service')
const serviceupdate = require('./api/serviceupdate')
const doccard = require('./api/doccard')
const addservice = require('./api/addservice')
const follower = require('./api/follower')
const following = require('./api/following')
const addfollow = require('./api/addfollow')
const income = require('./api/income')
const withdraw = require('./api/withdraw')
const withdrawlist = require('./api/withdrawlist')
const modifyInfo = require('./api/modifyInfo')
const msglist = require('./api/msglist')
const payorder = require('./api/payorder')
const show = require('./api/show')

//登录
router.post('/login',login)
//注册
router.post('/sign',sign)
//首页
router.post('/index', index)
//找专家
router.post('/findexpert', findexpert)
//服务列表
router.post('/servicelist', servicelist)
//服务总数
router.post('/servicetotal', servicetotal)
//服务详情
router.post('/service', service)
//发起服务
router.post('/addservice', addservice)
//修改服务状态
router.post('/serviceupdate', serviceupdate)
//医生名片
router.post('/doccard', doccard)
//我的粉丝
router.post('/follower', follower)
//我的关注
router.post('/following', following)
//建立关注关系
router.post('/addfollow', addfollow)
//我的收入
router.post('/income', income)
//提现
router.post('/withdraw', withdraw)
//提现列表
router.post('/withdrawlist', withdrawlist)
//编辑名片
router.post('/modifyinfo', modifyInfo)
//消息列表
router.post('/msglist', msglist)
//订单支付
router.post('/pay', payorder)
//展示服务
router.post('/show', show)

module.exports = router