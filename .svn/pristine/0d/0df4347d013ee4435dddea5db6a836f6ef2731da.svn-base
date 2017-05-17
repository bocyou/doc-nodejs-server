/**
 * Created by Administrator on 2017/2/13.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let info = await query('SELECT isRead FROM message WHERE msgId = ?', 1)
    if(info.obj[0].isRead) ctx.body = {code: 0, obj: true}
    else ctx.body = {code: 0, obj: false}
}