// pages/applyPages/hasApplyList/hasApplyList.js
import Utils from '../../../utils/utils'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark:'',
    successFlag:false,
    submitButtonShow:false,
    commentInfo:{
      attitude:0,
      packaging:0,
      deliverySpeed:0,
      handleSpeed:0
    },
    starText:{1:'非常不满意',2:'不满意',3:'一般',4:'满意',5:'非常满意'},
    paramJson:{detailFlag:false,type:'receipt'},
    req:{attitude:0,packaging:0,deliverySpeed:0,handleSpeed:0,remark:null}
  },
  /**
   * 页面初始化
   * @param {*} options 
   */
  onLoad: function (options) {
    let paramObj = JSON.parse(options.paramJson)
    this.setData({
      commentInfo:paramObj,
      paramJson:paramObj
    })
    if(paramObj.type==='refund'){
      wx.setNavigationBarTitle({
        title: '售后评价',
      })
    }
    if(paramObj.detailFlag){
      this.getCommentInfo()
    }else{
      this.setData({
        submitButtonShow:true
      })
    }
  },
  doneConfirm(e){
    this.setData({
      remark:e.detail.value
    })
  },
  changeRemark(e){
    console.log(e)
    this.setData({
      remark:e.detail.value
    })
    if(e.detail.cursor > 100){
     let str = this.data.remark.slice(0,100)
      this.setData({
        remark:str,
        'commentInfo.remark':str
      })
    }
  },
  //提交评价
  submitComment(){
    const data = this.judge()
    if(data){
      return wx.showToast({
        title: data,
        icon:'none'
      })
    } 
    wx.showLoading({mask:true})
    let reqData = this.data.req
    reqData.remark = this.data.remark
    reqData.supplierId = this.data.paramJson.supplierId
    reqData.commentType=this.data.paramJson.type
    if(this.data.paramJson.type==='receipt'){
      reqData.receiptId = this.data.paramJson.id
    }else if(this.data.paramJson.type==='refund'){
      reqData.refundId = this.data.paramJson.id
    }
    app.http.post(app.env.assetsUrl + '/minapp/asset/supplier/comment/save', reqData, {}).then(data => {
      wx.hideLoading({})
      wx.setNavigationBarTitle({
        title: '提交成功',
      })
      this.setData({
        successFlag:true
      })
    })
  },
  //查询评价信息
  getCommentInfo(){
    wx.setNavigationBarTitle({
      title: '我的评价',
    })
    wx.showLoading({mask:true})
    app.http.get(app.env.assetsUrl + '/minapp/asset/supplier/comment/detail/'+this.data.paramJson.id+'/'+this.data.paramJson.type, {}).then(data => {
      wx.hideLoading({})
      this.setData({
        successFlag:false,
        'param.detailShow':true,
        commentInfo: data.length > 0?data[0]:{}
      })
    })
  },
  judge(){//验证是否可以提交评价(待优化)
    if(!this.data.commentInfo.attitude){
      return'请对服务态度进行评价'
    }
    if(this.data.paramJson.type === 'receipt'){
      if(!this.data.commentInfo.packaging){
        return '请对商品包装进行评价'
      }
      if(!this.data.commentInfo.deliverySpeed){
        return '请对送货速度进行评价'
      }
    }else if(this.data.paramJson.type === 'refund'){
      if(!this.data.commentInfo.handleSpeed){
        return '请对处理速度进行评价'
      }
    }
    return false
  },
  //评价星星改变事件
  onChange(e){
    const value = e.detail
    const cloumn = e.currentTarget.dataset.desc
    this.data.req[cloumn] = value
    this.data.commentInfo[cloumn]= value
    this.data.commentInfo.remark = this.data.remark
    this.setData({
      req:this.data.req,
      commentInfo:this.data.commentInfo
    })
  },
  //返回首页
  goIndex(){
    wx.redirectTo({
      url: '../../index/index',
    })
  },
  //查看评论
  showDetail(){
    this.setData({
      submitButtonShow:false
    })
    this.getCommentInfo()
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
