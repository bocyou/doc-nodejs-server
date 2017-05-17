/**
 * Created by Administrator on 2017/2/7.
 */
const TopClient = require('./topClient').TopClient;
var client = new TopClient({
    'appkey': '23348843',
    'appsecret': '5faad3ebbf5022c24e0a3e60c64eff66',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

module.exports = (name,news,num)=>{
    console.log('name',name)
    console.log('news',news)
    console.log('num',num)
    return new Promise((resolve,reject)=>{
        client.execute('alibaba.aliqin.fc.sms.num.send', {
            'sms_type':'normal',
            'sms_free_sign_name':'医助医',
            'sms_param':'{\"doc\":\"'+name+'\",\"news\":\"'+news+'\"}',
            'rec_num':num,
            'sms_template_code':'SMS_44345742'
        }, function(error, response) {
            if (!error) resolve(response);
            else console.log(error);
        })
    })
}