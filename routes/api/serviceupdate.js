/**
 * Created by Administrator on 2017/1/20.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let serviceId = ctx.request.body.serviceId
    let state = ctx.request.body.state
    let docId = ctx.request.body.docId
    let scheduleTime = ctx.request.body.scheduleTime
    let rejectReason = ctx.request.body.rejectReason
    if (!docId) {
        ctx.body = {code: -1, msg: 'docId不可为空'}
    }
    if (serviceId) {
        let info = await query('SELECT * FROM service WHERE serviceId = ?', serviceId)
        if (info.obj[0].serviceId) {
            info = info.obj[0]
            if (state == 2) {
                if (docId == info.expertId) {
                    if (scheduleTime) {
                        let result = await query('UPDATE service SET ? WHERE serviceId = ?', [{
                            scheduleTime: scheduleTime,
                            state: state
                        }, serviceId])
                        if (result.obj) ctx.body = {code: 0}
                        else ctx.body = {code: -1, msg: result.msg}
                    } else ctx.body = {code: -1, msg: '安排时间不可为空'}
                } else ctx.body = {code: -1, msg: '只有专家才可确认服务'}
            } else if (state == 4) {
                if (docId == info.expertId) {
                    if (rejectReason) {
                        let result = await query('UPDATE service SET ? WHERE serviceId = ?', [{
                            rejectReason: rejectReason,
                            state: state
                        }, serviceId])
                        if (result.obj) ctx.body = {code: 0}
                        else ctx.body = {code: -1, msg: result.msg}
                    } else ctx.body = {code: -1, msg: '拒绝理由不可为空'}
                } else ctx.body = {code: -1, msg: '只有专家才可拒绝服务'}
            }
        }else ctx.body = {code: -1, msg: 'serviceId有误'}
    } else ctx.body = {code: -1, msg: 'serviceId不可为空'}
}