const router = require('koa-router')()
const connect = require('../public/connect')
const query = connect.query
const querystring = require("querystring")
const xml2js = require('xml2js')
const  parser = new xml2js.Parser()
const builder = new xml2js.Builder({rootName:'xml'})

router.get('/', (ctx, next)=> {
    let echostr = querystring.parse(ctx.querystring).echostr;
    ctx.body = echostr;
    console.log('get weichat info');
})
router.post('/pay', (ctx, next)=> {
    return new Promise((resolve,reject)=>{
        console.log(22222);
        if(ctx.is('text/xml')) {
            ctx.req.on('data',(data)=> {
                console.log('data1', data.toString());
                parser.parseString(data,async (err, result)=> {
                    console.log('result', result.xml);
                    if(result.xml.result_code[0] == 'SUCCESS'){
                        let service = await query('SELECT serviceId FROM payorder WHERE orderId = ?', result.xml.out_trade_no[0])
                        console.log('service',service)
                        let modifyService = await query('UPDATE service SET state = 3 WHERE serviceId = ?', service.obj[0].serviceId)
                        let modifyOrder = await query('UPDATE payorder SET state = 1 WHERE orderId = ?', result.xml.out_trade_no[0])
                        if(modifyService) console.log('订单支付成功')
                        else console.log(modifyService.msg)
                    }else console.log('订单支付失败')
                    //let xml = builder.buildObject(opt);
                    resolve('SUCCESS');
                })
            })
        }
    }).then((data)=>{
        ctx.body = data;
    })
})
module.exports = router