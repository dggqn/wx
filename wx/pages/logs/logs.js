// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  },
  goRecord(){
    wx.navigateTo({
      url: '/pages/record/record',
    })
  },
  onShow(){
    console.log("onshow......");
  },
  onReady(){
    console.log("onready.......");
  },
  onHide(){
    console.log("onhide......");
  },
  onUnload(){
    console.log("onUnload......");
  }
})
