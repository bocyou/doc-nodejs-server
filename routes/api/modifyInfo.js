/**
 * Created by Administrator on 2017/1/18.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let docId = ctx.request.body.docId
    let userName = ctx.request.body.userName
    let avatar = ctx.request.body.avatar
    let title = ctx.request.body.title
    let hospital = ctx.request.body.hospital
    let department = ctx.request.body.department
    let phoneNumber = ctx.request.body.phoneNumber
    let goodAt = ctx.request.body.goodAt
    let intro = ctx.request.body.intro
    let treatPrice = ctx.request.body.treatPrice
    let operationPrice = ctx.request.body.operationPrice
    let area = ctx.request.body.area
    let info = {}
    if(!docId){
        ctx.body = {code: -1, msg: 'docId不可为空'}
    }
    if(userName){
        Object.assign(info,{userName:userName})
    }
    if(avatar){
        Object.assign(info,{avatar:avatar})
    }
    if(title){
        Object.assign(info,{title:title})
    }
    if(hospital){
        Object.assign(info,{hospital:hospital})
    }
    if(department){
        Object.assign(info,{department:department})
    }
    if(phoneNumber){
        Object.assign(info,{phoneNumber:phoneNumber})
    }
    if(goodAt){
        Object.assign(info,{goodAt:goodAt})
    }
    if(intro){
        Object.assign(info,{intro:intro})
    }
    if(treatPrice){
        Object.assign(info,{treatPrice:treatPrice})
    }
    if(operationPrice){
        Object.assign(info,{operationPrice:operationPrice})
    }
    if(area){
        Object.assign(info,{area:area})
    }
    console.log('info',info)
    let result = await query('UPDATE doc SET ? WHERE docId = ?',[info,docId])
    if(result.obj) {
        let docInfo = await query('SELECT * FROM doc WHERE docId = ?',docId)
        ctx.body = {code: 0,obj:docInfo.obj[0]}
    }
    else ctx.body = {code: -1, msg: result.msg}
}