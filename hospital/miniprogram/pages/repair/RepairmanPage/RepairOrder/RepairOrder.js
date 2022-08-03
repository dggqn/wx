// pages/repair/RepairmanPage/RepairOrder/RepairOrder.js
import Utils from '../../../../utils/utils'
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    tab: 1,
  },
  goDetail(e) {
    let detail = JSON.stringify(e.currentTarget.dataset.itemdetail);
    wx.navigateTo({
      url: '/pages/repair/RepairmanPage/repairDetail/repairDetail?itemDetail=' + detail,
    })
  },
  changeTab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
  },
  /**
   * 获取报修单列表
   */
  getPepairOrder() {
    let that = this;
    let info = this.data.userInfo
    console.log({
      'userId': info.userId, //用户id
      'deptId': info.userDepts[0].deptId, //部门id
      'userIdentity': info.userIdentity, //是否上级
      'current': 1,
      'pageSize': 10
    })
    app.http.post('/assets/app/workorder/queryByParams', {
      userId: info.userId, //用户id
      deptId: info.userDepts[0].deptId, //部门id
      userIdentity: info.userIdentity, //是否上级
      current: 1,
      pageSize: 10
    }).then(data => {
      console.info(data.records);
      that.setData({
        repairList: data.records
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Utils.getUserInfo())
    this.setData({
      userInfo: Utils.getUserInfo()
    })
    this.getPepairOrder()
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
    this.getPepairOrder()
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