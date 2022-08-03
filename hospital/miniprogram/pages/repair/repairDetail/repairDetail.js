// pages/repair/repairDetail/repairDetail.js
import Utils from '../../../utils/utils'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPreNew: Utils.aliyunBaseImgUrlPreNew,
    step: 1,
    Qstate: '',
    detailData:{},
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
  clickImgHis: function(e){
    let imgUrl = e.currentTarget.dataset.url
    console.log(imgUrl)
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goRemark() {
    wx.navigateTo({
      url: '../repairFeedback/repairFeedback',
    })
  },
  goDetail(e) {
    let that = this
    let key = e.currentTarget.dataset.key
    let status = that.data.detailData.status
    let detail = e.currentTarget.dataset.itemdetail;
    console.log(e.currentTarget.dataset);
    console.log(that.data.detailData)
    let detailStr = JSON.stringify(that.data.detailData)
    if(status == 0){
      wx.navigateTo({
        url: '/pages/repair/repairDeclare/repairDeclare?itemDetail=' + detailStr,
      })
    }else if(status == 1){
      if(key == 'bt1'){
        console.log(111);
        wx.navigateTo({
          url: '/pages/repair/MemberList/MemberList?id=' + that.data.detailData.taskId,
        })
      }else if (key == 'close'){
        let params = {}
        params.status = '6'
        params.taskId = that.data.detailData
        let paramsStr = JSON.stringify(params);
        wx.navigateTo({
          url: '/pages/repair/repairPoint/repairPoint?params=' + paramsStr,
        })
      }
    }else if(status == '2'){
      status = '3'
      console.log(that.data.detailData.taskId)
      app.http.post('/assets/app/task/appoint', {
        taskId: that.data.detailData.taskId, //工单id
        status: status, //状态
      }).then(data => {
        wx.showToast({
          title: '接受完成',
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      })
    }else if(status == '3' || status == '4'){
      status = '5'
      let params = {}
      params.status = '5'
      params.taskId = that.data.detailData.taskId
      let detailStr = JSON.stringify(params);
      wx.navigateTo({
        url: '../repairPoint/repairPoint?params='+detailStr,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = JSON.parse(options.itemDetail)
    console.log(detail)
    let userInfo = Utils.getUserInfo()
    if(userInfo.entityId==detail.workerUser){
      this.setData({
        isSelf:true
      })
    }
    
    if(userInfo.isWxy){
      if(userInfo.userIdentity == '2'){
        this.setData({
          userLevel: 2
        })
      }else{
        this.setData({
          userLevel: 1
        })
      }
    }else{
      this.setData({
        userLevel: 0
      })
    }
    if(detail.image){
      detail.fileList = Utils.getImageArrByStr(detail.image)
    }
    if(detail.voice){
      detail.voiceList = Utils.getVoiceArrByStr(detail.voice)
    }
    console.info(detail);
    this.setData({
      detailData:detail
    })
    
    app.http.post('/assets/app/task/queryHisByParams',{
      taskId: detail.taskId, //工单id
    }).then(data => {
      let datalist = []
      data.forEach((child) => {
        if(child.image){
          console.info(child.image);
          child.fileList = Utils.getImageArrByStr(child.image)
        }
        datalist.push(child);
      });
      this.setData({
        hisData: datalist
      })
    })
  },
    //播放录音
    play: function (e) {
      console.log(e)
      // 获取innerAudioContext实例
      const innerAudioContext = wx.createInnerAudioContext()
      // 是否自动播放
      innerAudioContext.autoplay = true
      // 设置音频文件的路径
      innerAudioContext.src = this.data.detailData.voiceList[e.currentTarget.dataset.key-1].url;
      // 播放音频文件
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      });
      // 监听音频播放错误事件
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
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