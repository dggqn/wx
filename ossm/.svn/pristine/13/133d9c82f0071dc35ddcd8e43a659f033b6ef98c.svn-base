// miniprogram/pages/assetsInventory/taskDetails/taskDetails.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    determineShow: false,
    entityId: '',
    inputShow: false,
    categoryPopShow: false,
    classificationName: String,
    eleFlag: false,
    strList: String,
    assetData: {},
    assetBarcode: '',
    assetBarcodes: [],
    detail: {},
    isGains: false,
    submitData:{},
    keyword:'',
    categoryId:'',
    mark:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    const that=this
    this.setData({entityId: e.entityId});
    app.http.post(app.env.assetsUrl + '/minapp/check/queryCheckOrderDetailForMinApp', {
      entityId: this.data.entityId,
      keyword: this.data.keyword,
      categoryId:this.data.categoryId
    }).then(resp => {
      this.setData({
        detail: resp,
        assetBarcodes: resp.assetBarcodes
      })
    })
  },
  loadBaseData() {
    app.http.post(app.env.assetsUrl + '/minapp/check/queryCheckOrderDetailForMinApp', {
      entityId: this.data.entityId,
      keyword: this.data.keyword,
      categoryId:this.data.categoryId
    }).then(resp => {
      this.setData({
        detail: resp,
        assetBarcodes: resp.assetBarcodes
      })
    })
  },
  toAssetsDetail(e) {
    const that=this
    wx.navigateTo({
      url:'../assetsDetail/assetsDetail?entityId='+that.data.entityId+'&assetBarcode='+e.currentTarget.dataset.assetbarcode,
      events: {
        backFn: function(data) {
          that.loadBaseData()
        }
      }
    })
  },
  manualCheck() {
    const that=this
    wx.navigateTo({
      url:'../scanAsset/scanAsset?entityId='+that.data.entityId,
      events: {
        backFn: function(data) {
          that.loadBaseData()
        }
      }
    })
  },
  scan() {
    this.setData({assetData: {}, isGains: false})
    const that = this
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        that.setData({
          eleFlag: false,
          inputShow: true,
          assetBarcode: res.result
        })
        app.http.get(app.env.assetsUrl + '/minapp/asset/getByAssetBarcode/' + that.data.assetBarcode).then(data => {
          if (data) {
            wx.navigateTo({
              url:'../scanAsset/scanAsset?entityId='+that.data.entityId+'&assetBarcode='+that.data.assetBarcode,
              events: {
              backFn: function(data) {
                that.loadBaseData()
              }
            }
            })
          } else {
            wx.showToast({
              title: '无此资产',
              icon: 'none',
              duration: 2000
            })
          }
        });
      }
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
