// pages/collarRecords/collarRecords.js
import Utils from '../../utils/utils'

var app = getApp()
Component({
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.queryMyAssetCategory()
      this.init()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    map: null,
    req: {},
    //动态获取
    categoryOption: [
      { text: '按类别', value: '' }
    ],
    unitOption: [
      { text: '按时间', value: '' },
      { text: '最近一周', value: 'week' },
      { text: '最近一个月', value: 'month' },
      { text: '最近一年', value: 'year' }
    ]
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
   
  },
  methods:{
  init() {
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.env.assetsUrl + '/getAssetsRecord'
    app.http.get(url, this.data.req).then(resp => {
      this.setData({
        map: resp
      })
      wx.hideLoading()
    })
  },
  queryMyAssetCategory() {
    var url = app.env.assetsUrl + '/getMyAssetsRecordCategory'
    app.http.get(url).then(resp => {
      this.setData({
        categoryOption: resp
      })
    })
  },
  getCategory(e) {
    var req = this.data.req
    req.categoryId = e.detail
    this.setData({
      req: req
    })
    this.search()
  },
  getTime(e) {
    var req = this.data.req
    req.unit = e.detail
    this.setData({
      req: req
    })
    this.search()
  },
  inputKeyword(e) {
    var req = this.data.req
    req.keyword = e.detail.value
    this.setData({
      req: req
    })
  },
  search() {
    this.init()
  },
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
