const { default: Utils } = require("../../utils/utils");
import drawQrcode from '../../utils/weapp.qrcode.min.js'
var app = getApp()
// miniprogram/pages/identityCode/identityCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    time: 56,
    countdownTime: ''
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
      userDeptNames: Utils.getUserDepartName()
    })
    this.createQrCode()
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

  },
  createQrCode: function () {
    var that = this
    app.http.get(app.env.assetsUrl + '/qrcode/create').then(resp => {
      that.initQrCode(resp)
      that.countdown()
    })
  },
  initQrCode: function (resp) {
    var text = JSON.stringify({code:resp.code})
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: text,
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        // imageResource: '../../images/logo.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      }
    })
  },
  countdown: function () {
    this.setData({
      countdownTime: this.data.time
    })
    var intervalId = setInterval(() => {
      if (this.data.countdownTime <= 0) {
        clearInterval(intervalId)
        this.createQrCode()

        return
      }
      this.data.countdownTime--
    }, 1000)
  }

})
