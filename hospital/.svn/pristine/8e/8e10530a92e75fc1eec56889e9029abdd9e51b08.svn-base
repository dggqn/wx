// pages/repair/repairPoint/repairPoint.js
import Utils from '../../../utils/utils'

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    comment: ''
  },
  afterRead(event) {
      const that = this
      const {file} = event.detail;
      console.log(event)
      wx.uploadFile({
          url: app.env.url + app.env.assetsUrl + '/oss/upload',
          filePath: file.path,
          name: 'file',
          header: {
              'Authorization': 'bearer ' + wx.getStorageSync('hospital-token'),
              'Content-Type': 'multipart/form-data'
          },
          formData: {
              'file': file.path,
              'fileAccessPermission': 'PUBLIC_READ',
              'uploadFileType': 'IMAGE',
          },
          success: (data) => {
              const resultData = JSON.parse(data.data).data
              const f = {
                  url: resultData.url,
                  name: resultData.fileName
              }
              that.data.fileList.push(f)
              console.log(this.data.fileList)
              that.setData({
                  fileList: this.data.fileList
              })
          },
          fail(res) {
          }
      })
  },
  deleteImg(e) {
      this.data.fileList.splice(e.detail.index, 1);
      this.setData({
          fileList: this.data.fileList
      })
  },
  issueTextareaChange(e) {
    this.data.comment = e.detail.value;
    console.log( this.data.comment)
  },
  goDetail(e) {
    let that = this 
    console.log( that.data.comment)
    app.http.post('/assets/app/task/appoint', {
      taskId: that.data.taskId, //工单id
      status: that.data.status, //状态
      comment: that.data.comment, //备注
      image: Utils.getStrByArr(that.data.fileList), //照片
    }).then(data => {
      wx.showToast({
        title: '操作完成',
        icon: 'success',
        duration: 1500
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/repair/repairList/repairList',
        });
      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    let params = JSON.parse(options.params)
    this.setData({
      taskId: params.taskId,
      status: params.status
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})