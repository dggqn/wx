// pages/applyPages/applyCalendar/applyCalendar.js
import ApplyCalendarData from '../../../baseData/pages/applyCalendar/ApplyCalendarData'
import Utils from '../../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    year: new Date().getFullYear(),
    months: ApplyCalendarData.getMonths(new Date().getFullYear()),
    currentMonth: new Date().getMonth() // 0是1月
  },
  changeYear (e) {
    this.setData({
      year: e.detail.value,
      months: ApplyCalendarData.getMonths(e.detail.value)
    })
  },
  changeMonth (e) {
    this.setData({
      currentMonth: e.target.dataset.month
    })
    const monthStr = this.data.year + '-' + (this.data.currentMonth + 1)
    this.selectComponent('#calendar').creatCalendar(monthStr)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent('#calendar').creatCalendar(new Date())
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
