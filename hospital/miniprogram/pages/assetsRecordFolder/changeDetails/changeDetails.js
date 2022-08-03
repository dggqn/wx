// miniprogram/pages/assetsRecordFolder/changeDetails/changeDetails.js
import Utils from '../../../utils/utils'
import bindValueUtil from '../../../utils/bindValueUtil'
import ScanAnalysisUtils from "../../../utils/scanAnalysisUtils";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    stepsData:[1,2,3],
    showTextarea:false,//解决textarea提示文字样式问题
    detailsShow:false,
    directorShow:false,
    directorType:String,
    directorResult:false,
    directorRemark:'',
    ordersId: '',
    data: {},
    showCancel: false,
    showScrapCancel:false,
    cancelDialogShow: false,
    showScanReceiveButton: false,
    logType: 'check',
    checkLogList: [1,2,3],
    logList: [],
  },
  detailsClose(){this.setData({detailsShow:false})},
  submitDetails(){
    this.setData({detailsShow:false});
    wx.showToast({
      title: '成功',
    })
  },
  changeLogTypeCheck () {
    this.setData({logType:'check'});
  },
  changeLogTypeChange () {
    this.setData({logType:'change'});
  },
  cancelDialogClose() {
    this.setData({cancelDialogShow: false})
  },
  showCancelDialog(e){
    this.setData({cancelDialogShow:true})
  },
  directorRefuseShow(){
    this.setData({directorShow:true,directorResult:false,directorType:'驳回'})
    this.detailsInterval()
  },
  directorPassShow(){
    this.setData({directorShow:true,directorResult:true,directorType:'通过'})
    this.detailsInterval()
  },
  directorClose(){this.setData({directorShow:false})},
  detailsInterval(){
    if(!this.data.showTextarea){
      this.timerr = setInterval(()=>{
        this.setData({
          showTextarea:true
        })
      },2000)
    }
  },
  /**
   * 提交审批
   */
  submitDirector(){
    const req = {
      ordersId: this.data.ordersId,
      result: this.data.directorResult,
      taskId: this.data.data.taskId,
      approveRemark: this.data.directorRemark,
    }
    app.http.post(app.env.assetsUrl + '/minapp/ordersChange/approve',req).then(resp => {
      this.setData({directorShow:false});
      wx.showToast({
        title: '成功',
      })
      this.loadDetail()
    })

  },
  loadingTextarea(){
    this.setData({showTextarea:true})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ordersId: options.id
    })
    this.loadDetail()
  },
  /**
   * 计算按钮是否显示
   */
  calButtonShow() {
    const order = this.data.data
    const status = JSON.parse(order.status)
    const user = Utils.getUserInfo()
    if (status.code === 'wait_approval' && order.createUid === user.entityId) {
      this.setData({showCancel: true});
    } else {
      this.setData({showCancel: false});
    }
    if (status.code === 'wait_receive' && order.receiveUid === user.entityId) {
      this.setData({showScanReceiveButton: true});
    } else {
      this.setData({showScanReceiveButton: false});
    }
  },
  loadDetail() {
    app.http.post(app.env.assetsUrl + '/minapp/ordersChange/loadDetail', this.data.ordersId).then(resp => {
      if (resp.changeLogList) {
        for (let item of resp.changeLogList) {
          item.actionTypeObj = JSON.parse(item.actionType)
          item.actionTypeCode = item.actionTypeObj.code
        }
      }
      this.setData({data: resp});
      this.calButtonShow()
    })
    //查询审批日志
    app.http.get(app.env.assetsUrl + '/minapp/ordersChange/queryCheckLogList/'+this.data.ordersId).then(resp => {
      resp.forEach(r =>{
        r.actionType = JSON.parse(r.actionType)
      })
      this.setData({
        checkLogList: resp
      })
    })
  },
  cancelOrder() {
    const req = {entityId: this.data.ordersId, oprType: 'cancel'}
    app.http.post(app.env.assetsUrl + '/minapp/ordersChange/updateStatus', req).then(resp => {
      this.loadDetail()
      this.cancelDialogClose()
    })
  },
  viewValueChange(e) {
    bindValueUtil.viewValueChange(this,e)
  },
  scan() {
    const that = this
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        const paramMap = ScanAnalysisUtils.getParams(res.result);
        if (paramMap.type !== 'asset') {
          wx.showToast({
            title: '请扫描资产二维码',
            icon: 'none',
            duration: 2000
          })
          return
        }
        const changeDetails = that.data.data.changeDetails;
        const fixed = changeDetails.find(item => item.assetBarcode === paramMap.assetBarcode)
        if (!fixed) {
          wx.showToast({
            title: '请扫描本次变更的资产',
            icon: 'none',
            duration: 2000
          })
          return
        }
        const url = '/pages/assetsRecordFolder/assetsDetails/assetsDetails?assetBarcode=' + paramMap.assetBarcode;
        ScanAnalysisUtils.goAimPages(url,"navigateTo")
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
