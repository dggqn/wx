// miniprogram/pages/assetsRecordFolder/assetsDetails/assetsDetails.js
import Utils from "../../../utils/utils";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navActive:'basic',
    assetBarcode: '',
    origin: '',
    receiveId: '',
    showChangeButton: false,
    showReceiveButton: false,
    assetDetail: {}
  },
  flagNavClass(e){
    this.setData({navActive:e.currentTarget.dataset.info})
  }, 
  jumpAssetsChange(e){
    const list = [this.data.assetDetail]
    wx.navigateTo({
      url:'/pages/assetsRecordFolder/assetsChange/assetsChange?type='+ e.currentTarget.dataset.type +'&list='+ JSON.stringify(list)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const assetBarcode = options.assetBarcode
    this.setData({assetBarcode: assetBarcode})
    if (options.origin) {
      this.setData({origin: options.origin})
    }
    this.loadDetail();
  },

  calButtonShow() {
    const asset = this.data.assetDetail
    const user = Utils.getUserInfo()
    if (asset.ownerUid === user.entityId && JSON.parse(asset.status).code === 'in_use') {
      this.setData({showChangeButton: true});
    } else {
      this.setData({showChangeButton: false});
    }
    if (user.entityId === this.data.receiveId && JSON.parse(asset.status).code === 'moving') {
      this.setData({showReceiveButton: true});
    } else {
      this.setData({showReceiveButton: false});
    }
  },

  loadDetail() {
    app.http.post(app.env.assetsUrl + '/loadAssetDetail', this.data.assetBarcode).then(resp => {
      const detail = resp
      detail.statusName = JSON.parse(resp.status).name
      detail.statusCode = JSON.parse(resp.status).code
      this.setData({assetDetail: detail})
      this.getReceiverByAssetBarcode()
    })
  },

  getReceiverByAssetBarcode(){
    app.http.post(app.env.assetsUrl + '/minapp/ordersChange/getReceiverByAssetBarcode', this.data.assetBarcode).then(resp => {
      this.setData({receiveId: resp})
      this.calButtonShow()
    })
  },

  receiveAssets() {
    wx.showModal({
      title: '确认',
      content: '是否要接收该件资产?',
      showCancel: true,
      confirmText: '确定',
      success:  (res) => {
        if (res.confirm) {
          const req = {oprType: 'receive', assetId: this.data.assetDetail.entityId}
          app.http.post(app.env.assetsUrl + '/minapp/ordersChange/updateStatus', req).then(resp => {
            wx.showToast({icon: "none", title: "接收成功"})
            this.loadDetail()
          })
        }
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
