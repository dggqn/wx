import md5 from './md5.min.js'

import Config from "../config/index"

/**
 * 签名工具类
 */
export default class SignUtils {

    static separatorChar = ":";
    static publicKey = Config.env.publicKey


    /**
     * 生成签名
     * 签名数据：时间戳+":"+公钥+":"+uri（不包含参数)
     * @param config {
     *     uri: 指的是domain后面的url
     *     如 http://localhost:8080/api/test/v 则 url是 /api/test/v
     *     如 http://www.baidu.com/test/v 则 url是 /test/v
     * }
     */
    static sign = function (config) {
        var reqPath = config.url
        if (config.url.indexOf('http') >= 0) {
            reqPath = config.url.split('://')[1]
            reqPath = reqPath.substring(reqPath.indexOf('/'))
        }

        var timestamp = Date.now()

        reqPath = reqPath.split('?')[0]
        var signData = timestamp + SignUtils.separatorChar + SignUtils.publicKey + SignUtils.separatorChar + reqPath
        var authorization = config.headers['Authorization']
        if (authorization) {
          signData = signData + SignUtils.separatorChar + authorization;
        }
        var sign = md5(signData)
        config.headers['x--timestamp'] = timestamp
        config.headers['x--sign'] = sign
    }


}
