/**
 * Created by Administrator on 2017/1/16.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let followerId = ctx.request.body.followerId
    let followingId = ctx.request.body.followingId
    console.log('docId',followerId)
    if(!followerId){
        ctx.body = {code: -1, msg: '关注者id不可为空'}
    }else if(!followingId){
        ctx.body = {code: -1, msg: '被关注者id不可为空'}
    }else{
        let result = await query('SELECT * FROM follow WHERE followerId = ? AND followingId = ?', [followerId,followingId])
        console.log('result',result)
        if(result.obj.length == 0){
            let info = await query('INSERT INTO follow SET ?', {followerId:followerId,followingId:followingId,createdAt:new Date().getTime()})
            console.log('info',info)
            if (info.obj) {
                info = info.obj
                ctx.body = {code: 0, obj: info}
            } else ctx.body = {code: -1, msg: info.msg}
        }else ctx.body = {code: -1, msg: '已关注或者建立关注关系失败'}
    }
}