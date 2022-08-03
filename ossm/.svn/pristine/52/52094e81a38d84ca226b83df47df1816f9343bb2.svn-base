// pages/applyPages/scanSignAssets/scanSignAssets.js

import Utils from '../../../utils/utils'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    isEmpty: false,
    asset:{},
    aimDetail:{},
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      asset:JSON.parse(decodeURIComponent(options.assetJson))
    })
    this.data.aimDetail = JSON.parse(decodeURIComponent(options.aimDetail))
    this.data.orderId = options.orderId
  },

  receiveAsset () {
    const reqData = {
      entityId:this.data.orderId,
      detailList:[{
        entityId:this.data.aimDetail.entityId,
        assetId:this.data.asset.entityId,
        assetBarcode:this.data.asset.assetBarcode,
        modelId:this.data.asset.modelId,
        receiveCount:1
      }]
    }
    app.http.post(app.env.assetsUrl + '/minapp/receiveOrder/receiveAsset', reqData, {}).then(data => {
      console.info('resp:' + JSON.stringify(data))
      //使用Storage达到页面通讯目的
      wx.setStorageSync('receive_detailId', this.data.aimDetail.entityId);
      wx.navigateBack({delta: 1})
    });
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
