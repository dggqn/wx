const {
  default: Utils
} = require("../../utils/utils");
const {
  default: SubscribeMessageUtils
} = require("../../utils/subscribeMessageUtils")
var app = getApp()
// pages/personCenter/personCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    messageFlag: false,
    times: 0
  },

  subscribeMessage() {
    const keyList = SubscribeMessageUtils.getMessageTypeKeyList()
    let tmplIds = []
    tmplIds.push(SubscribeMessageUtils.getMessageType(keyList[(this.data.times * 3 + 0) % keyList.length]))
    tmplIds.push(SubscribeMessageUtils.getMessageType(keyList[(this.data.times * 3 + 1) % keyList.length]))
    tmplIds.push(SubscribeMessageUtils.getMessageType(keyList[(this.data.times * 3 + 2) % keyList.length]))
    SubscribeMessageUtils.subscribeMessage(tmplIds, (resp) => {
      if ((this.data.times + 1) * 3 < keyList.length) {
        wx.showToast({
          title: '您还有消息未订阅,可再次点击',
          icon: 'none'
        })
        this.setData({
          times: this.data.times + 1
        })
      }
    })
  },
  // 收货地址管理
  goAddressManage() {

  },
  logout() {
    const _this = this
    wx.showModal({
      title: '提示',
      content: '确认要切换账号吗',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('phone_number'); // 退出当前账号，清除本地存储的手机号
          _this.logoutBusiness();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  logoutBusiness() {
    // 调用系统管理的登出接口
    app.http.get(app.env.assetsUrl + '/minapp/user/logout').then(resp => {
      app.removeToken()
      Utils.removeOpenId()
      Utils.removeUserInfo()
      wx.reLaunch({
        url: '/pages/login/login',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: Utils.getUserInfo(),
      userDeptNames: Utils.getUserDepartName(),
      userDeptAddress: Utils.getUserDepartAddress()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})