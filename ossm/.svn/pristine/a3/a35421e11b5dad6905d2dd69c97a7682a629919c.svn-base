// pages/login/login.js
import Utils from '../../utils/utils'

var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    aimPageUrl: String
  },

  lifetimes: {
    created: function () {

    },
    attached: function () {
      // 在组件实例刚刚被创建时执行
      console.info('在组件实例刚刚被创建时执行')
      const token = app.getToken()
      if (token) {
        this.setData({
          isLogined: true
        })
        if (this.data.aimPageUrl) {
          wx.redirectTo({
            url: this.data.aimPageUrl,
          })
        } else {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      }
      else {
        wx.setNavigationBarTitle({
          title: '登录',
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    //是否已经登录
    isLogined: false,
    showUserInfoDialog: false,
    hospitalName: app.env.hospitalName
  },

  /**
   * 组件的方法列表
   */
  methods: {
    login(phone) {
      app.login(phone, 'BIND', ()=> {
        this.setData({
          showUserInfoDialog: true
        })
        if (this.data.aimPageUrl) {
          wx.redirectTo({
            url: this.data.aimPageUrl,
          })
        }
      })
    },
    getPhoneNumber(e) {
      // 真机可能出现「hideToast:fail:toast can't be found」导致小程序卡死？
      // wx.hideToast()
      let that = this
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        console.info('获取用户手机号：' + JSON.stringify(e.detail))
        wx.setStorage({
          data: e.detail,
          key: 'mobileNo',
        })
        that.login(e.detail)

      } else {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    },
  }
})
