// miniprogram/pages/assetsRecordFolder/assetsRecord/assetsRecord.js
import Utils from '../../../utils/utils'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    navActive:'change',
    paddingRight:Number,
    type: 0,
    list: [],
    assetsSortOption:[
      { text: '全部', value: 0 },
      { text: '我发起的', value: 2 },
      { text: '我接受的', value: 1 },
    ]
  },
  flagClass(e){
    this.setData({
      navActive:e.currentTarget.dataset.type,
      list:[]
    })
    if(e.currentTarget.dataset.type === "scrap") this.queryScrapList(1);
    if(e.currentTarget.dataset.type === "change") this.queryRecord();
  },
  queryScrapList(num){
    wx.showLoading({
      title: '加载中...',
    })
    const req = {
      current:num,
      pageSize:5
    }
    app.http.post(app.env.assetsUrl + '/minapp/ordersScrap/queryRecordList', req).then(resp => {
      resp.records.map(item=>{
        if(item.detailStatus){
          item.status = item.detailStatus
        }
        if(JSON.parse(item.status).code === 'finish'){
          item.statusName = '已报废'
        }
      })
      console.info('records======>',resp.records)
      this.setData({
        list: resp.records
      })
      wx.hideLoading()
    })
  },
  jumpDetails(e){
    wx.navigateTo({
      url: '/pages/assetsRecordFolder/assetsDetails/assetsDetails?assetBarcode=' + e.currentTarget.dataset.snno
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryRecord()
  },

  changeType(e) {
    this.setData({type: e.detail})
    this.queryRecord()
  },

  queryRecord() {
    wx.showLoading({
      title: '加载中...',
    })
    const req = {type: this.data.type}
    app.http.post(app.env.assetsUrl + '/minapp/ordersChange/queryRecordList', req).then(resp => {
      this.setData({
        list: resp.records
      })
      wx.hideLoading()
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
