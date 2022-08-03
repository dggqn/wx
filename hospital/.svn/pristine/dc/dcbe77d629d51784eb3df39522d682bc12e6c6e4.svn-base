// pages/notice/noticeDetail/noticeDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospitalName: app.env.hospitalName,
    notice:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const makeRead = options.makeRead=='1'?true:false;
    if(options.notice){
      const notice = JSON.parse(decodeURIComponent(options.notice))
      this.setData({
        notice: notice
      })
      if(makeRead){
        if(notice.readFlag != '1'){
          const reqUrl = app.env.assetsUrl + `/minapp/msg/readSiteMsg?noticeId=${notice.entityId}`
          app.http.get(reqUrl).then(data => {})
        }
      }
    }else if(options.id){
      app.http.get(app.env.assetsUrl + '/minapp/msg/getSiteMsg?noticeId='+options.id).then(data => {
        console.info('notice:' + JSON.stringify(data))
        this.setData({
          notice:data
        })
        if(makeRead){
          if(data.readFlag != '1'){
            const reqUrl = app.env.assetsUrl + `/minapp/msg/readSiteMsg?noticeId=${data.entityId}`
            app.http.get(reqUrl).then(data => {})
          }
        }
      })
    }
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