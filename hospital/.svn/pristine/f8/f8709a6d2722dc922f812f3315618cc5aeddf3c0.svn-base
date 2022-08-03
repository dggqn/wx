// pages/repair/repairDetail/repairDetail.js
import Utils from '../../../../utils/utils'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    detailData: [],
    hisData:[]
  },
  clickImg: function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    var imgUrl = this.data.detailData.fileList[id].url;
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goMemberList(e) {
    let id = e.currentTarget.dataset.taskid
    wx.navigateTo({
      url: '../MemberList/MemberList?id=' + id,
    })
  },
  //接受、完成任务
  operationTask(e) {
    console.log(e)
    let id = e.currentTarget.dataset.taskid
    let operation = e.currentTarget.dataset.operation
    app.http.post('/assets/app/workorderUser/accept', {
      workorderUserId: id,
      isAccept: operation,
    }).then(data => {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = JSON.parse(options.itemDetail)
    console.log(detail)
    this.setData({
      detailData: detail
    })
    this.setData({
      userInfo: Utils.getUserInfo()
    });
    
    console.info(detail.taskId);
    app.http.post('/assets/app/task/queryHisByParams',{
      taskId: detail.taskId, //工单id
    }).then(data => {
      console.info(data);
      this.setData({
        hisData: data
      })
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