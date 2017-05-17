/**
 * Created by Administrator on 2017/1/16.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let docId = ctx.request.body.docId
    let expertId = ctx.request.body.expertId
    let type = ctx.request.body.type
    let patientName = ctx.request.body.patientName
    let patientAge = ctx.request.body.patientAge
    let patientGender = ctx.request.body.patientGender
    let diseaseDesc = ctx.request.body.diseaseDesc
    let diseaseImg = ctx.request.body.diseaseImg
    let arr = {}
    let expertInfo,docinfo
    if (docId) {
        Object.assign(arr,{docId:docId})
        docinfo = await query('SELECT * FROM doc WHERE docId = ?', docId)
        if (docinfo.obj) docinfo = docinfo.obj
        else ctx.body = {code: -1, msg: '医生（发起人）Id有误或者不存在'}
    }
    if (expertId) {
        Object.assign(arr,{expertId:expertId})
        expertInfo = await query('SELECT * FROM doc WHERE docId = ?', expertId)
        if (expertInfo.obj){
            expertInfo = expertInfo.obj[0]
            console.log('expertInfo',expertInfo)
        } else ctx.body = {code: -1, msg: '专家Id有误或者不存在'}
    } else ctx.body = {code: -1, msg: '专家Id不可为空'}
    if (type == 1) {
        Object.assign(arr,{type:type})
        Object.assign(arr,{price:expertInfo.treatPrice})
        Object.assign(arr,{income:expertInfo.treatPrice})
    }else if (type == 2) {
        Object.assign(arr,{type:type})
        Object.assign(arr,{price:expertInfo.operationPrice})
        Object.assign(arr,{income:expertInfo.operationPrice})
    } else ctx.body = {code: -1, msg: '服务类型有误或者不存在'}
    if (patientName) {
        Object.assign(arr,{patientName:patientName})
    } else ctx.body = {code: -1, msg: '患者姓名不可为空'}
    if (patientAge) {
        Object.assign(arr,{patientAge:patientAge})
    } else ctx.body = {code: -1, msg: '患者年龄不可为空'}
    if (patientGender) {
        Object.assign(arr,{patientGender:patientGender})
    } else ctx.body = {code: -1, msg: '患者性别不可为空'}
    if (diseaseDesc) {
        Object.assign(arr,{diseaseDesc:diseaseDesc})
    } else ctx.body = {code: -1, msg: '疾病描述不可为空'}
    if (diseaseImg) {
        Object.assign(arr,{diseaseImg:diseaseImg.ToString})
    }
    Object.assign(arr,{createdAt:new Date().getTime()},{modifyAt:new Date().getTime()})
    console.log('arr',arr)
    let info = await query('INSERT INTO service SET ?', arr)
    if (info.obj) {
        info = info.obj
        ctx.body = {code: 0}
    } else ctx.body = {code: -1, msg: info.msg}

}