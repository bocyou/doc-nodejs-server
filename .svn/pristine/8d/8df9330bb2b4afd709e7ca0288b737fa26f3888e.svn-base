/**
 * Created by Administrator on 2017/1/13.
 */
const request = require('superagent')
const Redis = require('ioredis')
const redis = new Redis(6379, '127.0.0.1',{password: 'shnavy'})

module.exports = async ()=> {
    let access_token = await redis.get('access_token')
    console.log('access_token1',access_token)
    if (access_token) {
        console.log('access_token3',access_token)
        return access_token;
    } else {
        let access_token = await request('GET', 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxcce2dc954ed5710a&secret=8b4e454426d91dd4d5c1202e5d8b8a7f')
        access_token = JSON.parse(access_token.text)
        console.log('access_token2',access_token.access_token)
        redis.set('access_token', access_token.access_token)
        redis.expire('access_token', 3600)
        return access_token.access_token
    }
}