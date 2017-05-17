/**
 * Created by Administrator on 2017/1/13.
 */
const request = require('superagent')
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let code = ctx.request.body.code
    console.log('code', code)
    let temp = await request('GET', 'https://api.weixin.qq.com/sns/jscode2session?appid=wxcce2dc954ed5710a&secret=8b4e454426d91dd4d5c1202e5d8b8a7f&js_code=' + code + '&grant_type=authorization_code')
    temp = JSON.parse(temp.text)
    console.log('text', temp)
    if (temp.errcode) ctx.body = temp
    else {
        let result = await query('SELECT * FROM doc WHERE openid = ?', temp.openid)
        console.log('doc', result)
        if (result.obj.length==0) ctx.body = {code: 0, openid:temp.openid}
        else if(result.obj.length>0) ctx.body = {code: 0, obj: result.obj[0]}
        else if (result.msg) ctx.body = {code: -1, msg: result.msg}
    }
}