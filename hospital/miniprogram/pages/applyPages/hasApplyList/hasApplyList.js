// pages/applyPages/hasApplyList/hasApplyList.js
import Utils from '../../../utils/utils'

var app = getApp()

const list = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    tab: 'apply',
    queryCond: {
      size: 20,
      current: 1,
      keyword: '',
      status: '',
    },
    isLoadingFlag: true, // 请求完成一次加载下一次，防止重复加载
    list:list,
    total:0,
    confirmReceiptShow:false
  },
// vant组件所需方法
  confirmReceiptClose(){
    this.setData({ confirmReceiptShow: false });
  },
  reSubmit(e){
    wx.navigateTo({
      url:'../postSale/postSale?entityId='+e.currentTarget.dataset.entityid
    })
  },
  confirmReceipShowPopup(e){
    this.setData({ confirmReceiptShow: true,selectedOrdersId:e.currentTarget.dataset.entityid });
  },
  confirmReceive(e){
    const that=this
    app.http.post(app.env.assetsUrl + '/minapp/refundOrder/updateConfirmOrders', {
      ordersId:this.data.selectedOrdersId
    }, {}).then(data => {
      that.setData({ confirmReceiptShow: false });
      wx.showToast({
        title: '收货成功',
        icon: 'success',
        duration: 2000
      })
      that.initCurrentAndQuery()
    })
  },
  cancelReceivingGoods(){
    this.setData({ confirmReceiptShow: false });
  },
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        tab:options.type
      })
    }
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
      aimObj[pathArray[length-1]] = value
      if(sync){
        const syncData = {}
        syncData[pathArray[0]] = this.data[pathArray[0]]
        this.setData(syncData)
      }
    }
  },
  changeTab (e) {
    if(e.currentTarget.dataset.tab === this.data.tab){
      return
    }
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
    this.setData({
      list:[],
      queryCond: {
        size: 20,
        current: 1,
        keyword: '',
        status: ''
      }
    })
    this.initCurrentAndQuery();
  },
  receiveStatusChange () {
    if(this.data.queryCond.status === 'wait_receive'){
      this.data.queryCond.status = ''
    }else {
      this.data.queryCond.status = 'wait_receive'
    }
    this.setData({
      queryCond:this.data.queryCond
    })
    //触发查询
    this.initCurrentAndQuery();
  },
  deliverStatusChange () {
    if(this.data.queryCond.status === 'wait_receive'){
      this.data.queryCond.status = ''
    }else {
      this.data.queryCond.status = 'wait_receive'
    }
    this.setData({
      queryCond:this.data.queryCond
    })
    //触发查询
    this.initCurrentAndQuery();
  },
  initCurrentAndQuery () {
    this.data.queryCond.current = 1
    this.query()
  },
  // 上拉加载
  bindscrolltolower () {
    if (!this.data.isLoadingFlag) {
      return
    }
    this.data.queryCond.current++
    this.query()
  },
  query () {
    if(this.data.tab==='apply'){
      this.queryApply()
    }else if(this.data.tab==='receive'){
      this.queryReceive()
    }else if(this.data.tab==='deliver'){
      this.queryDeliver()
    }else if(this.data.tab==='receipt'){
      this.queryReceipt()
    }else if(this.data.tab==='afterSales'){
      this.queryRefund()
    }
  },
  queryReceipt () {
    const reqData = {
      ...this.data.queryCond
    }
    if(this.data.queryCond.current !== 1 && this.data.total<=this.data.list.length){
      return
    }
    app.http.post(app.env.assetsUrl + '/minapp/receiptOrder/query', reqData, {}).then(data => {
      if(data.records.length>0){
        for (let i = 0; i < data.records.length; i++) {
          data.records[i].receiptType = JSON.parse(data.records[i].receiptType)
        }
      }
      this.queryDataHandle(data);
    })
  },
  queryDeliver () {
    const reqData = {
      ...this.data.queryCond
    }
    if(this.data.queryCond.current !== 1 && this.data.total<=this.data.list.length){
      return
    }
    app.http.post(app.env.assetsUrl + '/minapp/deliverOrder/query', reqData, {}).then(data => {
      this.queryDataHandle(data);
    })
  },
  queryApply () {
    const reqData = {
      ...this.data.queryCond
    }
    if(this.data.queryCond.current !== 1 && this.data.total<=this.data.list.length){
      return
    }
    this.setData({
      isLoadingFlag: false
    })
    app.http.post(app.env.assetsUrl + '/minapp/apply/query', reqData, {}).then(data => {
      this.setData({
        isLoadingFlag: true
      })
      this.queryDataHandle(data);
    })
  },
  queryRefund () {
    const reqData = {
      ...this.data.queryCond
    }
    if(this.data.queryCond.current !== 1 && this.data.total<=this.data.list.length){
      return
    }
    this.setData({
      isLoadingFlag: false
    })
    app.http.post(app.env.assetsUrl + '/minapp/refundOrder/queryRefundOrdersForMinapp', reqData, {}).then(data => {
      this.setData({
        isLoadingFlag: true
      })
      this.queryDataHandle(data);
    })
  },
  queryReceive () {
    const reqData = {
      ...this.data.queryCond
    }
    if(this.data.queryCond.current !== 1 && this.data.total<=this.data.list.length){
      return
    }
    const _this = this
    app.http.post(app.env.assetsUrl + '/minapp/receiveOrder/query', reqData, {}).then(data => {
      console.info('receivelist:' + JSON.stringify(data))
      this.data.total = data.total
      if (this.data.queryCond.current === 1) {
        this.setData({
          list: data.records
        })
      }else {
        if (data.records.length<=0) {
          wx.showToast({
            title: '已经到底了',
            icon: 'none'
          })
        }else {
          this.setData({
            list: this.data.list.concat(data.records)
          })
        }
      }
    })
  },
  queryDataHandle (data) {
    this.data.total = data.total
    if (this.data.tab === 'apply') {
      data.records = this.insertReceiveRate(data.records)
    }
    if (this.data.queryCond.current === 1) {
      this.setData({
        list: data.records
      })
    }else {
      if (data.records.length<=0) {
        wx.showToast({
          title: '已经到底了',
          icon: 'none'
        })
      }else {
        this.setData({
          list: this.data.list.concat(data.records)
        })
      }
    }
  },
  insertReceiveRate(array = []) {
    if (array && array.length > 0) {
      array.forEach(item => {
        item.receiveRate = parseInt((item.receivedDetailCount/(item.receivedDetailCount+item.unFinishDetailCount)) * 100)
      });
    }
    return array
  },
  goReceiptDetail (e) {
    wx.navigateTo({
      url: '/pages/applyPages/receiptDetail/receiptDetail?entityId='+e.currentTarget.dataset.entityid,
    })
  },
  goRefundDetail (e) {
    wx.navigateTo({
      url: '/pages/applyPages/cargoDetails/cargoDetails?entityId='+e.currentTarget.dataset.entityid,
    })
  },
  goReceiveDetail (e) {
    wx.navigateTo({
      url: '/pages/applyPages/receiveDetail/receiveDetail?entityId='+e.currentTarget.dataset.entityid,
    })
  },
  goDeliverDetail (e) {
    wx.navigateTo({
      url: '/pages/applyPages/deliverDetail/deliverDetail?entityId='+e.currentTarget.dataset.entityid,
    })
  },
  goApplyDetail (e) {
    wx.navigateTo({
      url: '/pages/applyPages/applyInvoiceDetail/applyInvoiceDetail?entityId='+e.currentTarget.dataset.entityid,
    })
  },
  goDetail (e) {
    let url = ''
    if (this.data.tab === 'apply') {
      url = '/pages/applyPages/applyInvoiceDetail/applyInvoiceDetail'
    } else if (this.data.tab === 'collar') {
      url = '/pages/applyPages/collarInvoiceDetail/collarInvoiceDetail'
    } else {
      url = '/pages/applyPages/signInvoiceDetail/signInvoiceDetail'
    }
    wx.navigateTo({
      url: url,
    })
  },
  goDetail1 (e) {
    wx.navigateTo({
      url: '/pages/applyPages/applyInvoiceDetail/applyInvoiceDetail',
    })
  },
  goDetail2 (e) {
    wx.navigateTo({
      url: '/pages/applyPages/collarInvoiceDetail/collarInvoiceDetail',
    })
  },
  goDetail3 (e) {
    wx.navigateTo({
      url: '/pages/applyPages/signInvoiceDetail/signInvoiceDetail',
    })
  },
  goScanSignAsset(){
    wx.navigateTo({
      url: '/pages/applyPages/scanSignAssets/scanSignAssets',
    })
  },
  goScanSignComsum(){
    wx.navigateTo({
      url: '/pages/applyPages/scanSignComsum/scanSignComsum',
    })
  },
  goScanSignEmpty(){
    wx.navigateTo({
      url: '/pages/applyPages/scanSignEmpty/scanSignEmpty',
    })
  },

  // 申领日历
  applyCalendar () {
    wx.navigateTo({
      url: '/pages/applyPages/applyCalendar/applyCalendar',
    })
  },

  //评价
  comment(e){
    const type = e.currentTarget.dataset.type
    const obj = e.currentTarget.dataset.json
    const param = {supplierId:obj.supplierId,id:obj.entityId,supplierName:obj.supplierName,
      type:type,detailFlag:false}
    console.info("comment",e)
    wx.navigateTo({
      url: '../comment/comment?paramJson='+JSON.stringify(param),
    })
  },
  //查看评价
  loadComment(e){
    const type = e.currentTarget.dataset.type
    const obj = e.currentTarget.dataset.json
    const param = {supplierId:obj.supplierId,id:obj.entityId,supplierName:obj.supplierName,
      type:type,detailFlag:true}
    wx.navigateTo({
      url: '../comment/comment?paramJson='+JSON.stringify(param),
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
    this.data.queryCond.size = this.data.queryCond.current * this.data.queryCond.size
    this.data.queryCond.current = 1
    this.initCurrentAndQuery()
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
    this.data.queryCond.current += 1;
    this.query();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
