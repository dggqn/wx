// pages/repair/RepairmanPage/MemberList/MemberList.js
import Utils from '../../../utils/utils'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workorderId: '',
    checked: []
  },
  /**
   * 获取部门用户
   */
  getUserByDept() {
    let that = this;
    console.log(Utils.getUserInfo().userDepts[0].deptId)
    app.http.post('/assets/app/user/getUserByDept', Utils.getUserInfo().userDepts[0].deptId).then(data => {
      console.info(data);
      that.setData({
        repairList: data
      })
    })
  },
  /**
   * 上级指派订单给部门用户
   */
  appoint() {
    let that = this;
    if (this.data.checked.length < 1) {
      wx.showToast({
        title: '请选择维修员',
        icon: 'error'
      })
      return;
    }
    console.log(that.data)
    console.log({
      'workorderId': that.data.workorderId, //工单id
      'userIds': that.data.checked, //用户id数组
      'userIdentity': Utils.getUserInfo().userIdentity, //是否上级： 1用户 2上级
    })
    app.http.post('/assets/app/task/appoint', {
      taskId: that.data.taskId, //工单id
      status: '2', //状态
      workerUser: that.data.checked.join("||") //用户id数组
    }).then(data => {
      wx.showToast({
        title: '分派完成',
        icon: 'success',
        duration: 1500
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 2
        })
      }, 1000)
    })
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
    console.log(this.data.checked)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.id)
    this.setData({
      taskId: options.id
    })
    this.getUserByDept()
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