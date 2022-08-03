const {JSEncrypt} = require('./jsencrypt.min')
const encryptor = new JSEncrypt()
import Config from "../config/index"

encryptor.setPublicKey(Config.env.publicKey)
/**
 * 非对称加密工具类
 */
export default class EncryptUtils {


    //十六进制转字节
    static hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    // 字节转十六进制
    static bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
    }


    static encryptLong = function (d) {
        // 存在中文的情况下如果不encode ，后台解密会失败
        d = encodeURIComponent(d)
        var k = encryptor.key;
        var maxLength = (((k.n.bitLength() + 7) >> 3) - 11);

        try {
            var lt = "";
            var ct = "";

            if (d.length > maxLength) {
                lt = d.match(/.{1,117}/g);
                lt.forEach(function (entry) {
                    var t1 = k.encrypt(entry);
                    ct += t1;
                });
                return ct;
            }
            var t = k.encrypt(d);
            return t;
        } catch (ex) {
            return false;
        }
    }

    /**
     * 加密请求参数
     * @param config
     *
     */
    static encrypt = function (config) {
        var contentType = config.headers['Content-type'] || config.headers['Content-Type']
        if (contentType && contentType.indexOf('multipart/form-data') >= 0) {
            return
        }


        // 1.非URL参数
        if (config.params) {
            const encryptParam = this.encryptLong(JSON.stringify(config.params))
            config.params = {
                '__param': encryptParam
            }
        } else {
            config.params = {}
        }
        //2.url ? 参数
        // 将URL也进行加密传递，主要是URL会存在？参数的情况
        if (config.url.indexOf('?') > 0) {
            var encryptUrl = this.encryptLong(config.url)
            config.params['__url'] = encryptUrl
            config.url = config.url.split('?')[0]
        }

        //3.RequestBody 参数
        if (config.data) {
            const datajson = JSON.stringify(config.data)
            console.log(datajson.length)
            if (datajson.length < 5244) {
                const encryptParam = this.encryptLong(JSON.stringify(config.data))
                config.data = {
                    '__param': encryptParam
                }
            } else {
                if (config.headers['x--sign']) {
                    config.data.__param = config.headers['x--sign']
                } else {
                    config.data.__param = '9999'
                }
            }
        }
    }

}
