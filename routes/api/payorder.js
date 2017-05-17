/**
 * Created by Administrator on 2017/1/23.
 */
const connect = require('../../public/connect')
const query = connect.query
const request = require('superagent')
const crypto = require('crypto')
const xml2js = require('xml2js')
const  parser = new xml2js.Parser()
const builder= new xml2js.Builder({rootName:'xml'})

module.exports = async (ctx, next)=> {
    return new Promise(async (resolve,reject) =>{
        let docId = ctx.request.body.docId
        let serviceId = ctx.request.body.serviceId
        var ip = ctx.req.headers['x-real-ip'] || ctx.req.headers['x-forwarded-for']
        console.log('ip',ip)
        console.log('docId', docId)
        console.log('serviceId', serviceId)
        if(serviceId){
            let info = await query('SELECT docId, price, state FROM service WHERE serviceId = ?', serviceId)
            if(info.obj){
                if(docId == info.obj[0].docId){
                    if(info.obj[0].state == 2){
                        let openid = await query('SELECT openid FROM doc WHERE docId = ?',docId)
                        openid = openid.obj[0].openid
                        let md5sum = crypto.createHash('md5')
                        let ran = Math.round(Math.random()*1000) + ''
                        md5sum.update(ran)
                        let str =md5sum.digest('hex')
                        console.log('str',str)
                        let key = 'hztywl1610hztywl1610hztywl1610hz'
                        let orderObj = {
                            serviceId:serviceId,
                            createdAt: new Date().getTime(),
                            total_fee:info.obj[0].price*100
                        }
                        let signOrder = await query('INSERT INTO payorder SET ?', orderObj)
                        console.log('signOrder',signOrder)
                        console.log('orderId',signOrder.obj.insertId)
                        let opt = {
                            appid:'wxcce2dc954ed5710a',
                            mch_id:'1419007002',
                            nonce_str:str,
                            body:'服务订单支付',
                            out_trade_no:signOrder.obj.insertId,
                            total_fee:info.obj[0].price*100,
                            spbill_create_ip:ip,
                            notify_url:'https://shnavy.com/wx/pay',
                            trade_type:'JSAPI',
                            openid:openid
                        }
                        let stringA = 'appid=' + opt.appid + '&body=' + opt.body + '&mch_id=' + opt.mch_id + '&nonce_str=' + opt.nonce_str + '&notify_url=' + opt.notify_url + '&openid=' + opt.openid + '&out_trade_no=' + opt.out_trade_no + '&spbill_create_ip=' + opt.spbill_create_ip + '&total_fee=' + opt.total_fee + '&trade_type=' + opt.trade_type + '&key=' + key
                        console.log('stringA',stringA)
                        let md5 = crypto.createHash('md5')
                        md5.update(stringA)
                        let sign = md5.digest('hex').toUpperCase()
                        console.log('sign',sign)
                        opt = Object.assign(opt,{sign:sign})
                        let xml = builder.buildObject(opt);
                        console.log('xml',xml)
                        request.post('https://api.mch.weixin.qq.com/pay/unifiedorder').set('Content-Type', 'application/xml').send(xml)
                            .end((err,res)=>{
                                console.log('res',res.text)
                                let timeStamp = new Date().getTime()/1000
                                parser.parseString(res.text, (err, result)=> {
                                    console.log('result', result)
                                    let string = 'appId=' + opt.appid + '&nonceStr=' + opt.nonce_str + '&package=prepay_id=' + result.xml.prepay_id[0] + '&signType=MD5&timeStamp=' + timeStamp+ '&key=' + key
                                    let md5 = crypto.createHash('md5')
                                    md5.update(string)
                                    let sign = md5.digest('hex').toUpperCase()
                                    resolve({
                                        code:0,
                                        obj:{
                                            timeStamp:timeStamp,
                                            nonceStr:opt.nonce_str,
                                            package:'prepay_id=' + result.xml.prepay_id[0],
                                            paySign:sign,
                                            signType:'MD5'
                                        }
                                    })
                                })
                            })
                    }else resolve({code: -1, msg: '服务状态有误'})
                }else  resolve({code: -1, msg: 'docId与serviceId不匹配'})
            }else resolve({code: -1, msg: info.msg})
        }else resolve({code: -1, msg: 'serviceId不可为空'})
    }).then((data)=>{
        ctx.body = data
    })
}