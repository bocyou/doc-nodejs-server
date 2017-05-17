/**
 * Created by Administrator on 2017/1/16.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let sender = ctx.request.body.sender
    let page = ctx.request.body.page - 1 || 0
    let docId = ctx.request.body.docId
    let sql = ''
    if (sender == 1) {
        sql = 'a.expertId = b.docId WHERE a.docId'
        console.log('sender',sender)
    } else if (sender == 2) {
        sql = 'a.docId = b.docId WHERE a.expertId'
        console.log('sender',sender)
    } else ctx.body = {code: -1, msg: 'sender参数错误'}
    console.log('req', ctx.request.body)
    let list = await query('SELECT a.*, b.userName, b.avatar, b.docId infoId FROM service a LEFT JOIN `doc` b ON ' + sql + ' = ? ORDER BY a.modifyAt DESC LIMIT ?,10', [docId, page*10])
    console.log('list', list)
    let arr = []
    if (list.obj) {
        list = list.obj
        list.map((e)=> {
            arr.push({
                service: {
                    serviceId: e.serviceId,
                    docId: e.docId,
                    expertId: e.expertId,
                    type: e.type,
                    createdAt: e.createdAt,
                    patientName: e.patientName,
                    patientAge: e.patientAge,
                    patientGender: e.patientGender,
                    diseaseDesc: e.diseaseDesc,
                },
                doc: {
                    userName: e.userName,
                    avatar: e.avatar,
                    docId: e.infoId
                }
            })
        })
        ctx.body = {code: 0, list: list}
    } else ctx.body = {code: -1, msg: list.msg}
}