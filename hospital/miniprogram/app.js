//app.js
import Config from './config/index'
import PermissionUtils from './utils/PermissionUtils';
import Request from './utils/request'
import Utils from './utils/utils'
App({
  aimPath: '',
  onLaunch: function (object) {
    let aimPath = object.path;
    aimPath = '/' + aimPath
    let query = object.query;
    let queryStr = ''
    for (let queryKey in query) {
      queryStr = queryStr + "&&" + queryKey + "=" + query[queryKey]
    }
    if (queryStr != '') {
      queryStr = queryStr.substr(2)
      aimPath = aimPath + "?" + queryStr
    }
    if (aimPath == '/pages/login/login') {
      aimPath = '/pages/index/index'
    }
    this.appId = wx.getAccountInfoSync().miniProgram.appId
    this.env = Config.getEnv()
    var token = this.getToken()

    console.info(__wxConfig.envVersion)
    wx.getSystemInfo({
      success: (result) => {
        console.info("SOG:" + result)
      },
    })
    if (this.env.ENV == 'local' && token) {
      // 已经登录
      wx.redirectTo({
        url: aimPath,
      })
    } else {
      //登录
      this.aimPath = aimPath
      this.wxLogin()
    }
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库使用云能力")
    } else {
      wx.cloud.init ({
        // env 参数说明：
        // env 参数决定接下来小程序发起的云开发调用 (wx.cloud.xxx) 会默认请求到哪个云环境的资源
        // 此处请填入环境 ID ，环境 ID 可打开云控制台查看
        // 如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })	
    }
    this.globalData = {}
  },
  env: {},
  globalData: {
    userInfo: null,
    openid: Utils.getOpenId(),
    sessionKey: '',
    appId: wx.getAccountInfoSync().miniProgram.appId
  },
  http: new Request(),
  wxLogin(fn) {
    this.getCode()
  },
  //登录授权获取code
  getCode(fn) {
    wx.clearStorageSync()
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    let that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          that.getOpenId(res.code)
        }
      }
    })
  },
  //根据code换取openId
  getOpenId(code) {
    let that = this
    this.http.get(this.env.uaaUrl + '/wx/openId/' + code).then(data => {
      console.info('获取openid:' + JSON.stringify(data))
      that.globalData.openid = data.openid
      Utils.setOpenId(data.openid)
      that.globalData.sessionKey = data.sessionKey
      that.login(null, 'LOGIN')
    })
  },
  //获取用户信息
  getUserInfo(token, callback) {
    console.info('开始获取用户信息')
    let that = this
    this.http.get(this.env.uaaUrl + '/user/info?access_token=' + token).then(resp => {
      wx.hideToast()
      let userInfo = resp.user
      console.warn(resp.authorities)
      // 判断普通用户才可以登录
      if (PermissionUtils.hasPermission(resp.authorities, 'ROLE_ptyh') ||
        PermissionUtils.hasPermission(resp.authorities, 'ROLE_admin')) {
        console.info(PermissionUtils.hasPermission(resp.authorities, 'ROLE_psy'))
        if (PermissionUtils.hasPermission(resp.authorities, 'ROLE_psy')) {
          userInfo.isPsy = true;
        }
        if (PermissionUtils.hasPermission(resp.authorities, "ROLE_wxy")) {
          userInfo.isWxy = true;
        }
        Utils.setUserInfo(userInfo)
        if (callback) {
          callback()
        }
      } else {
        wx.showModal({
          showCancel: false,
          content: '该用户无小程序访问权限',
          success: function () {
            that.removeToken()
            Utils.removeOpenId()
            Utils.removeUserInfo()
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        })

      }
    })
  },
  login(phone, type, callback) {
    let that = this
    let loginUrl = that.env.uaaUrl + '/oauth/token'
    let body = {
      'username': that.globalData.openid,
      'password': that.globalData.openid,
      'client_id': that.env.clientId,
      'client_secret': that.env.clientSecret,
      'scope': that.env.scope,
      'grant_type': 'password',
      'loginType': 'HOSPITAL_WX_MINAPP',
      'type': type,
      'phone': phone
    }
    // 原本使用开发能力获取手机号需要后台解密现在不用了直接传phone
    // if (phone) {
    // 	//第一次绑定时需传
    // 	body.iv = phone.iv
    // 	body.encryptedData = phone.encryptedData
    // 	body.sessionKey = that.globalData.sessionKey
    // }
    let config = {
      'contentType': 'application/x-www-form-urlencoded',
      'clientAuth': true
    }
    console.log(body)
    that.http.post(loginUrl, body, config).then(resp => {
      console.info('登录返回:' + JSON.stringify(resp))
      if (resp.access_token) {
        that.setToken(resp.access_token)
        that.getUserInfo(resp.access_token, () => {
          if (type != "BIND") {
            if (this.aimPath != null && this.aimPath != '') {
              wx.redirectTo({
                url: this.aimPath,
              })
              this.aimPath = ''
            } else {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }
          }
          if (callback) {
            callback()
          }
        })

      } else if (resp.error_description == 'NOT_LOGGED_IN') {
        wx.hideToast({
          success: (res) => {},
        })
        // wx.showToast({
        // 	icon: 'none',
        // 	title: '请点击微信授权登录进行手机号绑定',
        // 	duration: 4000
        // });
        this.goLoginPage()
      } else if (resp.error_description != 'NOT_LOGGED_IN') {
        wx.showModal({
          content: resp.error_description,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
        this.goLoginPage()
      } else {
        this.goLoginPage()
      }
    })
  },
  goLoginPage() {
    wx.removeStorageSync('phone_number'); // 该手机号登录失败，清除本地存储的手机号

    const pages = getCurrentPages() //获取加载的页面
    if (pages != null && pages.length >= 1) {
      if (pages[pages.length - 1].route != 'pages/login/login') {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    }
  },
  setToken(token) {
    wx.setStorage({
      data: token,
      key: 'hospital-token',
    })
  },
  getToken() {
    return wx.getStorageSync('hospital-token')
  },
  removeToken() {
    wx.removeStorageSync('hospital-token')
  }
})
// "packOptions": {
// 	"ignore": [
// 		{
// 			"type": "folder",
// 			"value": "images"
// 		}
// 	]
// },