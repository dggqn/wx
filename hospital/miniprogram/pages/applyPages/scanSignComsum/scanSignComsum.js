// pages/applyPages/scanSignComsum/scanSignComsum.js
import Utils from '../../../utils/utils'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    detailList:[],
    orderId: '',
    orderType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '签收',
    })
    const detailList = JSON.parse(decodeURIComponent(options.detailList));
    for (var i = 0; i < detailList.length; i++) {
      const item = detailList[i]
      item.receiveCount = item.totalCount
    }
    this.setData({
      orderId:options.orderId,
      orderType:options.orderType,
      detailList:detailList
    })
  },
  viewValueChange (e) {
    if(e.currentTarget.dataset.path){
      const pathArray = e.currentTarget.dataset.path.split(".")
      const length = pathArray.length
      let aimObj = this.data
      for (var i = 0; i < length-1; i++) {
        aimObj = aimObj[pathArray[i]]
      }
      let value = e.detail.value
      let sync = false
      if(e.currentTarget.dataset.minvalue){
        if(parseInt(e.currentTarget.dataset.minvalue)>parseInt(value)){
          value = parseInt(e.currentTarget.dataset.minvalue)
          sync = true
        }
      }
      if(e.currentTarget.dataset.maxvalue){
        if(parseInt(e.currentTarget.dataset.maxvalue)<parseInt(value)){
          value = parseInt(e.currentTarget.dataset.maxvalue)
          sync = true
        }
      }
      aimObj[pathArray[length-1]] = value
      if(sync){
        const syncData = {}
        syncData[pathArray[0]] = this.data[pathArray[0]]
        this.setData(syncData)
      }
    }
  },
  receiveCountChange (e) {
    const index = parseInt(e.currentTarget.dataset.index)
    const count = parseInt(e.currentTarget.dataset.count)
    this.data.detailList[index].receiveCount = parseInt(this.data.detailList[index].receiveCount)+count;
    if(this.data.detailList[index].receiveCount<0){
      this.data.detailList[index].receiveCount = 0;
    }
    if(this.data.detailList[index].receiveCount>parseInt(this.data.detailList[index].totalCount)){
      this.data.detailList[index].receiveCount = parseInt(this.data.detailList[index].totalCount);
    }
    this.setData({
      detailList: this.data.detailList
    })
  },

  receiveComsum () {
    if(this.data.orderType=='deliver'){
      this.deliverReceipt();
    }else if(this.data.orderType=='receive'){
      this.receiveReceipt();
    }
  },
  deliverReceipt () {
    const reqData = {
      entityId:this.data.orderId,
      detailList:[]
    }
    for (var i = 0; i < this.data.detailList.length; i++) {
      const item = this.data.detailList[i]
      reqData.detailList.push({
        entityId:item.entityId,
        modelId:item.modelId,
        receiveCount:item.receiveCount
      })
    }
    app.http.post(app.env.assetsUrl + '/minapp/deliverOrder/receipt', reqData, {}).then(data => {
      console.info('resp:' + JSON.stringify(data))
      //使用Storage达到页面通讯目的
      wx.setStorageSync('receive_comsum', true);
      wx.navigateBack({delta: 1})
    });
  },
  receiveReceipt () {
    const reqData = {
      entityId:this.data.orderId,
      detailList:[]
    }
    for (var i = 0; i < this.data.detailList.length; i++) {
      const item = this.data.detailList[i]
      reqData.detailList.push({
        entityId:item.entityId,
        modelId:item.modelId,
        receiveCount:item.receiveCount
      })
    }
    app.http.post(app.env.assetsUrl + '/minapp/receiveOrder/receiveAsset', reqData, {}).then(data => {
      console.info('resp:' + JSON.stringify(data))
      //使用Storage达到页面通讯目的
      wx.setStorageSync('receive_comsum', true);
      wx.navigateBack({
        delta: 1
      })
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
