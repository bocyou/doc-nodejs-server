/**
 * Created by Administrator on 2017/2/6.
 */
const connect = require('../../public/connect')
const query = connect.query
const request = require('superagent')
const https = require('https')
const crypto = require('crypto')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const builder= new xml2js.Builder({rootName:'xml'})
const fs = require('fs')

module.exports = async (ctx, next)=> {
    return new Promise(async (resolve,reject) =>{
        let docId = ctx.request.body.docId
        let amount = ctx.request.body.amount
        var ip = ctx.req.headers['x-real-ip'] || ctx.req.headers['x-forwarded-for']
        console.log('ip',ip)
        console.log('docId', docId)
        console.log('amount', amount)
        if(docId){
            let info = await query('SELECT balance,openid FROM doc WHERE docId = ?', docId)
            if(info.obj){
                if(info.obj[0].balance>amount){
                        let md5sum = crypto.createHash('md5')
                        let ran = Math.round(Math.random()*1000) + ''
                        md5sum.update(ran)
                        let str =md5sum.digest('hex')
                        console.log('str',str)
                        let key = 'hztywl1610hztywl1610hztywl1610hz'
                        let opt = {
                            mch_appid:'wxcce2dc954ed5710a',
                            mchid:'1419007002',
                            nonce_str:str,
                            desc:'医助医提现',
                            partner_trade_no:new Date().getTime() + '' + Math.round(Math.random()*1000000000),
                            amount:amount*100,
                            spbill_create_ip:ip,
                            check_name:'NO_CHECK',
                            openid:info.obj[0].openid
                        }
                        let stringA = 'amount=' + opt.amount + '&check_name=' + opt.check_name + '&desc=' + opt.desc + '&mch_appid=' + opt.mch_appid + '&mchid=' + opt.mchid + '&nonce_str=' + opt.nonce_str + '&openid=' + opt.openid + '&partner_trade_no=' + opt.partner_trade_no + '&spbill_create_ip=' + opt.spbill_create_ip + '&key=' + key
                        console.log('stringA',stringA)
                        let md5 = crypto.createHash('md5')
                        md5.update(stringA)
                        let sign = md5.digest('hex').toUpperCase()
                        console.log('sign',sign)
                        opt = Object.assign(opt,{sign:sign})
                        let xml = builder.buildObject(opt);
                        console.log('xml',xml)
                        let pfx = fs.readFileSync(__dirname + '/../../public/apiclient_cert.p12')
                        let options = {
                            hostname:'api.mch.weixin.qq.com',
                            port:443,
                            path:'/mmpaymkttransfers/promotion/transfers',
                            method:'POST',
                            pfx:pfx,
                            passphrase:Buffer.from('1419007002'),
                            headers:{
                                'Content-Type': 'text/xml',
                            }
                        }
                        let req = https.request(options, (res)=>{
                            let rawData = ''
                            res.on('data',(d)=>{
                                rawData += d
                            })
                            res.on('end',()=>{
                                console.log('rawData',rawData.toString())
                                parser.parseString(rawData,async (err, result)=> {
                                    console.log('result', result.xml)
                                    if(result.xml.result_code[0] == 'SUCCESS'){
                                        let obj = await query('INSER INTO withdraw SET ?',{
                                            createdAt:new Date().getTime(),
                                            docId:docId,
                                            withdraw:amount
                                        })
                                        if(obj.obj) resolve('提现成功！')
                                        else ctx.body = {code: -1, msg: obj.msg}
                                    }
                                })
                            })
                        })
                        req.write(xml)
                        req.end()
                }else ctx.body = {code: -1, msg: '账户余额不足'}
            }else ctx.body = {code: -1, msg: info.msg}
        }else ctx.body = {code: -1, msg: 'docId不可为空'}
    }).then((data)=>{
        ctx.body = {code: 0, obj: data}
    })
}