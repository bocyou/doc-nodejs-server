/**
 * Created by Administrator on 2017/1/17.
 */
const connect = require('../../public/connect')
const query = connect.query
const qiniu = require('../../public/upload')
const request = require('superagent')
const areaconvert = require('../../public/areaconvert')
const sms = require('../../public/sms')

module.exports = async (ctx, next)=> {
    let body = ctx.request.body
    console.log('body', body)
    if(!body.openid){
        ctx.body = {code: -1, msg: '用户openid不可为空'}
    }else if(body.userInfo){
        console.log('avatarUrl',body.userInfo.avatarUrl)
        let path = await request('GET',body.userInfo.avatarUrl)
        path = path.body
        let img = await qiniu(path)
        let area = areaconvert(body.userInfo.province)
        let opt = {
            openid: body.openid,
            userName: body.userInfo.nickName,
            avatar: img,
            gender: body.userInfo.gender,
            area: area,
            createdAt: new Date().getTime()
        }
        if(opt.userName.indexOf('rdgztest')>0) sms('系统', '腾讯测试人员注册了', 15267607634)
        let sign = await query('INSERT INTO doc SET ?', opt)
        if (sign.obj){
            let userinfo = await query('SELECT * FROM doc WHERE openid = ?',body.openid)
            ctx.body = {code: 0, obj: userinfo.obj[0]}
        }
        else ctx.body = {code:-1,msg:sign.msg}
    }else ctx.body = {code: -1, msg: '用户userInfo对象不可为空'}
}