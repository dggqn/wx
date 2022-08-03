const { default: Utils } = require("../../utils/utils")

let app = getApp()
Component({
  data: {
    title: '微信授权',
    content: '获得您的公开信息(昵称、头像等)',
    logName: '智慧后保',
    showUserInfoDialog: true
  },
  lifetimes: {
    ready: function () {

    }
  },
  methods: {
    cancelCallback() {
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
    },
    updateUserInfo(wxUserInfo){
      let userId = Utils.getUserInfo().entityId

      let url = app.env.uaaUrl +'/wx/minapp/updateUser/' + userId
      let body = wxUserInfo
      app.http.put(url, body, {}).then(resp => {
        let page = getCurrentPages()
        //将当前页面的授权弹窗的弹出
        page.pop().setData({
          showUserInfoDialog:false
        })
        wx.redirectTo({
          url: '/pages/index/index',
          // url: '/pages/applyPages/applyRes/applyRes',
        })
      })
    },
    handleGetUserInfo(e) {
      if (e.detail.userInfo){
        console.info('获取的用户信息：' + JSON.stringify(e.detail.userInfo))
        console.info(JSON.stringify(e.detail))
        this.updateUserInfo(e.detail)
      } else{
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
    getUserProfile() {
      wx.getUserProfile({
        desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.info(JSON.stringify(res))
          this.updateUserInfo(res)
        },
        fail: (res) => {
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
      })
    }
  }
})
