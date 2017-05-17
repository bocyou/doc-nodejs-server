/**
 * Created by Administrator on 2017/1/16.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let serviceId = ctx.request.body.serviceId
    console.log('serviceId',serviceId)
    let info = await query('SELECT * FROM service WHERE serviceId = ?', serviceId)
    console.log('info',info)
    if(info.obj){
        info = info.obj[0]
        console.log('info.obj',info)
        if(info.diseaseImg){
            info.diseaseImg = info.diseaseImg.split(",")
        }
        let expert = await query('SELECT docId, userName, avatar, title, hospital, department FROM doc WHERE docId IN (?) ORDER BY FIELD(docId,?,?)', [[info.expertId, info.docId],info.expertId, info.docId])
        console.log('expert',expert)
        let obj={
            expert:expert.obj[0],
            doc:expert.obj[1],
            service:info
        }
        ctx.body = {code:0, obj:obj}
    }else ctx.body = {code:-1, msg:info.msg}
}