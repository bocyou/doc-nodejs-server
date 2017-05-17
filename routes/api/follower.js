/**
 * Created by Administrator on 2017/1/16.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let docId = ctx.request.body.docId
    console.log('docId', docId)
    let info = await query('SELECT b.userName, b.avatar, b.title, b.hospital, b.department, b.docId FROM follow a LEFT JOIN `doc` b ON a.followerId = b.docId WHERE a.followingId = ?', docId)
    if (info.obj) {
        info = info.obj
        ctx.body = {code: 0, obj: info}
    } else ctx.body = {code: -1, msg: info.msg}
}