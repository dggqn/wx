// pages/positionCodePages/positionHistory/positionHistory.js
import Utils from "../../../utils/utils";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    LocationList: []
  },
 
  /**
   * 获取14天位置记录
   * @param {*} phone 电话号码
   */
  getLocationHistory(phone) {
    let that = this;
    console.log(phone)
    app.http.get('/uaa/wx/minapp/locationTrackList', {
      tel: phone
    }).then(data => {
      console.info(data);
      that.setData({
        LocationList: data
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.phone);
    this.getLocationHistory(options.phone);
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