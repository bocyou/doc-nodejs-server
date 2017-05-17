/**
 * Created by Administrator on 2017/1/19.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let docId = ctx.request.body.docId
    console.log('docId', docId)
    let sendTotal = await query('SELECT COUNT(1) count FROM service WHERE docId = ?', docId)
    let receiveTotal = await query('SELECT COUNT(1) count FROM service WHERE expertId = ?', docId)
    if (sendTotal.obj&&receiveTotal.obj) {
        sendTotal = sendTotal.obj[0].count
        receiveTotal = receiveTotal.obj[0].count
        console.log('sendTotal',sendTotal)
        console.log('receiveTotal',receiveTotal)
        ctx.body = {code: 0, obj: {sendTotal:sendTotal,receiveTotal:receiveTotal}}
    } else ctx.body = {code: -1, msg:'查询有误'}
}