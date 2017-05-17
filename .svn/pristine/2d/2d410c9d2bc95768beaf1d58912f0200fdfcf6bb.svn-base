/**
 * Created by Administrator on 2017/1/13.
 */
const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    //password : '645314Benvirus',
    password: '123456',
    database: 'doc'
})
const query = (sql, data) => {
    return new Promise((resolve, reject) => {
        console.log('sql',sql)
        pool.query(sql, data, (err, rows) => {
            if (err) {
                resolve({msg: err})
            }
            if (rows) {
                resolve({obj: rows})
            }
        })
    })
}

const queryall = (arr) => {
    let list = []
    for (let i = 0; i < arr.length; i++) {
        list.push(
            new Promise((resolve, reject) => {
                console.log('sql',arr[i][0])
                pool.query(arr[i][0], arr[i][1], (err, rows)=> {
                    if (err) {
                        resolve({msg: err})
                    }
                    if (rows) {
                        resolve({obj: rows})
                    }
                })
            })
        )
    }
    return Promise.all(list)
}

module.exports = {query, queryall}