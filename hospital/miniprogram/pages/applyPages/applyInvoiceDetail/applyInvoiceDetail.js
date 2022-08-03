// pages/applyPages/applyInvoiceDetail/applyInvoiceDetail.js
import Utils from '../../../utils/utils'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    tab: 'all',
    entityId:'',
    orderInfo:{},
    detailList:[],
    applyTemplateShow: false,
    applyTemplate:{
      templateName:'',//必须
      remark:'',
      detailList:[{
        modelId:'', //必须
        totalCount:0,//必须
        remark:'',//必须
        name:'',
        specificationName:'',
        displayImgUrl:''
      }]
    }
  },
  viewValueChange (e) {
    console.log(e);
    this.setData({
      'applyTemplate.templateName':e.detail.value
    })
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

      if(e.currentTarget.dataset.arrayremovevalue){
        if(parseInt(e.currentTarget.dataset.arrayremovevalue)==parseInt(value)){
          let aimRemoveObj = this.data
          for (var i = 0; i < length-3; i++) {
            aimRemoveObj = aimRemoveObj[pathArray[i]]
          }
          aimRemoveObj[pathArray[length-3]].splice(pathArray[length-2],1)
          sync = true
        }
      }

      if(sync){
        const syncData = {}
        syncData[pathArray[0]] = this.data[pathArray[0]]
        this.setData(syncData)
      }
    }
  },
  commomCountChange (e) {
    const path = e.currentTarget.dataset.path
    const count = parseInt(e.currentTarget.dataset.count)
    if(path && count){
      const pathArray = e.currentTarget.dataset.path.split(".")
      const length = pathArray.length
      let aimObj = this.data
      for (var i = 0; i < length-1; i++) {
        aimObj = aimObj[pathArray[i]]
      }
      let value = parseInt(aimObj[pathArray[length-1]]) + count
      if(e.currentTarget.dataset.minvalue){
        if(parseInt(e.currentTarget.dataset.minvalue)>parseInt(value)){
          value = parseInt(e.currentTarget.dataset.minvalue)
        }
      }
      if(e.currentTarget.dataset.maxvalue){
        if(parseInt(e.currentTarget.dataset.maxvalue)<parseInt(value)){
          value = parseInt(e.currentTarget.dataset.maxvalue)
        }
      }
      aimObj[pathArray[length-1]] = value
      if(e.currentTarget.dataset.arrayremovevalue){
        if(parseInt(e.currentTarget.dataset.arrayremovevalue)==parseInt(value)){
          let aimRemoveObj = this.data
          for (var i = 0; i < length-3; i++) {
            aimRemoveObj = aimRemoveObj[pathArray[i]]
          }
          aimRemoveObj[pathArray[length-3]].splice(pathArray[length-2],1)
        }
      }
      const syncData = {}
      syncData[pathArray[0]] = this.data[pathArray[0]]

      this.setData({
        applyTemplate:this.data.applyTemplate
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.entityId = options.entityId
    // this.loadOrder();
  },
  loadOrder () {
    //加载详情
    app.http.get(app.env.assetsUrl + '/minapp/apply/load/'+this.data.entityId).then(data => {
      this.data.orderInfo = {...data}
      delete this.data.orderInfo.detailList;
      for (let i = 0; i < data.detailList; i++) {
        data.progress  = JSON.parse(data.progress)
      }
      this.data.detailList = data.detailList;
      this.setData({
        orderInfo:this.data.orderInfo,
        detailList:this.data.detailList
      })
    });
  },

  chanegTab (e) {
    const tab = e.currentTarget.dataset.tab;
    if(tab!=this.data.tab){
      this.setData({
        tab:tab
      })
    }
  },
  cancelApplyDetail (e) {
    const _this = this
    wx.showModal({
      title: '提示',
      content: '确认要取消申领吗',
      success (res) {
        if (res.confirm) {
          const reqData = {
            ordersId:_this.data.entityId,
            detailIdList:[e.currentTarget.dataset.entityid],
            // detailCancelReason:''
          }
          app.http.post(app.env.assetsUrl + '/minapp/apply/cancelApply', reqData, {}).then(data => {
            console.info(data)
            _this.loadOrder();
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  goReceive (e) {
    const item = e.currentTarget.dataset.data
    console.log(item)
    if (item.deliverOrderId) {
      wx.navigateTo({
        url: '/pages/applyPages/deliverDetail/deliverDetail?entityId='+item.deliverOrderId
      })
    }else if (item.receiveOrderId){
      wx.navigateTo({
        url: '/pages/applyPages/receiveDetail/receiveDetail?entityId='+item.receiveOrderId,
      })
    }
  },

  // 设为申领模板
  setApplyTemplate () {
    const applyTemplate = {
      templateName:'',//必须
      remark:this.data.orderInfo.remark,
      detailList:[]
    }
    for (let i = 0; i < this.data.detailList.length; i++) {
      const detail = this.data.detailList[i]
      applyTemplate.detailList.push({
        modelId:detail.modelId, //必须
        totalCount:detail.totalCount,//必须
        remark:detail.remark,
        name:detail.name,
        stockUnit: detail.stockUnit,
        specificationName:detail.specificationName,
        displayImgUrl:detail.displayImgUrl,
      })
    }
    this.setData({
      applyTemplateShow: true,
      applyTemplate:applyTemplate
    })
  },
  /**
   * 存为模板
   */
  saveTemplate () {
    if(this.data.applyTemplate.templateName.trim()==''){
      wx.showToast({ title: '请输入模板名称', icon: 'none' });
      return
    }
    const reqData = {...this.data.applyTemplate}
    app.http.post(app.env.assetsUrl + '/minapp/applyTemplate/insert', reqData, {}).then(data => {
      wx.showToast({ title: '添加成功', icon: 'none' });
      this.setData({
        applyTemplateShow: false
      })
    })
  },
  closeSpecModal () {
    this.setData({
      applyTemplateShow: false
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
    this.loadOrder();
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
