const local = require('./local.env')
const uat = require('./uat.env')
const prod = require('./prod.env')
const releaseEnv = 'prod'//发布不同环境时修改此处
export default class Config {

  static env = Config.getEnv()

  static getEnv() {
    // develop, //开发版
    // trial, //体验版
    // release, //正式版
    console.info("当前小程序版本:" + __wxConfig.envVersion)
    if (__wxConfig.envVersion == 'trial') {
      return uat
    }
    if (__wxConfig.envVersion == 'release') {
      return prod
    }
    if ('local' === releaseEnv) {
      return local
    }
    if ('uat' === releaseEnv) {
      return uat
    }
    if ('prod' === releaseEnv) {
      return prod
    }
    return prod
  }
}
