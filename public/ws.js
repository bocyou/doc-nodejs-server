/**
 * Created by Administrator on 2017/1/17.
 */
const connect = require('./connect')
const query = connect.query
const queryall = connect.queryall
const sms = require('./sms')

module.exports = (ws, wss)=> {
    ws.on('message', async (msg)=> {
        msg = JSON.parse(msg)
        console.log('received', msg);
        if (msg.senderId && msg.receiverId) {
            ws.senderId = msg.senderId
            ws.receiverId = msg.receiverId
            ws.dialogId = msg.senderId<msg.receiverId?msg.senderId+'-'+msg.receiverId:msg.receiverId+'-'+msg.senderId
            let list = await queryall([
                ['SELECT * FROM message WHERE dialogId = ? ORDER BY createdAt DESC LIMIT ?,10', [ws.dialogId, 0]],
                ['SELECT userName,docId,avatar FROM doc WHERE docId = ?', msg.senderId],
                ['SELECT userName,docId,avatar FROM doc WHERE docId = ?', msg.receiverId]
            ])
            ws.send(JSON.stringify({code: 0,obj: {list: list[0].obj, sender: list[1].obj, receiver: list[2].obj}}))
            query('UPDATE message SET isRead = 0 WHERE receiverId = ?', [ws.senderId])
        } else if (ws.senderId && ws.receiverId) {
            let obj = {
                senderId: ws.senderId,
                receiverId: ws.receiverId,
                msgText: msg.msgText,
                msgPic: msg.msgPic,
                createdAt: new Date().getTime(),
                dialogId:ws.dialogId
            }
            let message = await query('INSERT INTO message SET ?', obj)
            console.log('message', message)
            if (message.obj) {
                console.log('receiverId', ws.receiverId)
                ws.send(JSON.stringify(Object.assign(obj,{msgId:message.obj.insertId})))
                wss.clients.forEach(async (client)=> {
                    if (client.dialogId == ws.dialogId && client.senderId == ws.receiverId) {
                        client.send(JSON.stringify(Object.assign(obj,{msgId:message.obj.insertId})))
                        console.log('msgId', message.obj.insertId)
                        query('UPADTE message SET isRead = 0 WHERE msgId = ?', message.obj.insertId)
                    }else {
                        let result = await query('SELECT phoneNumber FROM doc WHERE docId = ? ', [ws.receiverId])
                        let senderName = await query('SELECT userName FROM doc WHERE docId = ?', [ws.senderId])
                        senderName = senderName.obj[0].userName
                        if(result.obj[0].phoneNumber){
                            let news = ''
                            if(msg.msgText) news = msg.msgText
                            else news = '图片'
                            await sms(senderName, news, result.obj[0].phoneNumber)
                        }else console.log('接受者不在线且接受者手机号为空')
                    }
                })
            }
        } else ws.send(JSON.stringify({msg: 'senderId和receiverId不可为空'}))
    });
}