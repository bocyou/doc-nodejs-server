/**
 * Created by Administrator on 2017/1/18.
 */
const connect = require('../../public/connect')
const query = connect.query
const queryall = connect.queryall

module.exports = async (ctx, next)=> {
    let senderId = ctx.request.body.senderId
    let receiverId = ctx.request.body.receiverId
    let page = ctx.request.page - 1 || 0
    if (senderId && receiverId) {
        let dialogId = senderId<receiverId?senderId+'-'+receiverId:receiverId+'-'+senderId
        let list = await queryall([
            ['SELECT * FROM message WHERE dialogId = ? ORDER BY createdAt DESC LIMIT ?,10', [dialogId, page*10]],
            ['SELECT userName,docId,avatar FROM doc WHERE docId = ?', senderId],
            ['SELECT userName,docId,avatar FROM doc WHERE docId = ?', receiverId]
        ])
        if (list[0].obj) ctx.body = {code: 0,obj: {list: list[0].obj, sender: list[1].obj, receiver: list[2].obj}}
        else ctx.body = {code: -1, msg: list[0].msg}
        query('UPDATE message SET isRead = 0 WHERE receiverId = ?', [senderId])
    } else ctx.body = {code: -1, msg: 'senderId和receiverId不可为空'}
}