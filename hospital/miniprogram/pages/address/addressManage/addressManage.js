// miniprogram/pages/address/addressManage/addressManage.js
import Utils from '../../../utils/utils'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getAddressList () {
    app.http.post(app.env.assetsUrl + '/minapp/addr/myAddress',  {ownerType: 'user'}, {}).then(data => {
      this.setData({
        addressList: data
      })
      this.selectComponent('#address-cell').setList(this.data.addressList)
    })
  },
  addAddress () {
    wx.navigateTo({
      url: '/pages/address/addOrModifyAddress/addOrModifyAddress?operate=add',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList()
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
