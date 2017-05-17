/**
 * Created by Administrator on 2017/1/16.
 */
const connect = require('../../public/connect')
const query = connect.query

module.exports = async (ctx, next)=> {
    let area = ctx.request.body.area
    let department = ctx.request.body.department
    let title = ctx.request.body.title
    let page = ctx.request.body.page - 1 || 0
    let sql = 'WHERE', arr = []
    if (area) {
        sql += ' area = ?'
        arr.push(area)
    }
    if (department) {
        sql += ' department = ?'
        arr.push(department)
    }
    if (title) {
        sql += ' title = ?'
        arr.push(title)
    }
    arr.push(page*10)
    console.log('sql', sql)
    console.log('arr', arr)
    if(sql == 'WHERE') sql =''
    let list = await query('SELECT userName, docId, avatar, title, hospital, department FROM doc ' + sql + ' LIMIT ?,10', arr)
    console.log('list', list)
    if (list.obj) {
        list = list.obj
        ctx.body = {code: 0, list: list}
    } else ctx.body = {code: -1, msg: info.msg}
}