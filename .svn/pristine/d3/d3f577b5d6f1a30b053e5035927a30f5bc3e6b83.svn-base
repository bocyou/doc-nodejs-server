/**
 * Created by Administrator on 2017/1/13.
 */
const connect = require('../../public/connect')
const queryall = connect.queryall

module.exports = async (ctx, next)=> {
    let docId = ctx.request.body.docId
    let page = ctx.request.body.page - 1 || 0
    console.log('docId', docId)
    if(docId){
        let result = await queryall([
            ['SELECT followerTotal, followingTotal FROM doc WHERE docId = ?', docId],
            ['SELECT * FROM (SELECT a.msgId , a.senderId, a.receiverId, a.createdAt, a.msgText, a.msgPic, a.dialogId, b.userName senderName, b.avatar senderAvatar, b.docId senderDocId, c.unread, d.userName receiverName, d.avatar receiverAvatar, d.docId receiverDocId FROM message a LEFT JOIN `doc` b ON a.senderId = b.docId LEFT JOIN `doc` d ON a.receiverId = d.docId LEFT JOIN (SELECT COUNT(1) unread, receiverId FROM message WHERE receiverId = ? AND isRead = 1) as c ON a.receiverId = c.receiverId WHERE a.receiverId = ? OR a.senderId = ? ORDER BY a.createdAt DESC LIMIT ?,10) as t GROUP BY t.dialogId ORDER BY t.createdAt DESC', [docId, docId, docId, page*10]]
        ])
        console.log('result', result)
        if (result[1].obj) {
            let msgArr = [], opt
            result[1].obj.map((e)=> {
                if (e.senderId == docId) {
                    opt = {
                        userName: e.receiverName,
                        docId: e.receiverDocId,
                        avatar: e.receiverAvatar
                    }
                } else {
                    opt = {
                        userName: e.senderName,
                        docId: e.senderDocId,
                        avatar: e.senderAvatar
                    }
                }
                msgArr.push({
                    unread: e.unread,
                    msg: {
                        msgId: e.msgId,
                        senderId: e.senderId,
                        receiverId: e.receiverId,
                        createdAt: e.createdAt,
                        msgText: e.msgText,
                        msgPic: e.msgPic
                    },
                    sender: opt
                })
            })
            console.log('msgArr', msgArr)
            ctx.body = {code: 0, total: result[0].obj[0], obj: msgArr}
        } else ctx.body = {code: -1, msg: info.msg}
    }else ctx.body = {code: -1, msg: 'docId不可为空'}
}