// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    timer:null,
    n:0,
    msg:'你好,',
    count: 0,
    seturl:'https://pic.3gbizhi.com/2019/1004/20191004022220800.jpeg',
    seturl2:'http://img.mm4000.com/file/8/e8/9571f515a7.jpg',
    seturl3:'http://img.mm4000.com/file/5/cf/b52b962167.jpg',
    motto: Math.random()*10,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  start(){
    let that = this
    that.timer = setInterval(() => {
      that.setData({
        n:that.data.n+1
      })
      console.log(that.data.n);
    }, 1500)
  },
  end(){
    console.log(this.timer);
    clearInterval(this.timer)
  },
  btn1(){
    console.log('点击+1');
    this.setData({
      count:this.data.count + 1
    })
  },
  btn2(e){
    console.log(e.target.dataset);
    this.setData({
      count:this.data.count + e.target.dataset.info
    })
  },
  inputchange(e){
    console.log(e.detail.value);
    this.setData({
      msg:e.detail.value
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  intoWorld(){
    wx.navigateTo({
      url: '../local/local',
    })
  },
  getRecord(){
    wx.navigateTo({
      url: '../record/record',
    })
  },
  handleGetUserInfo(e){
    console.log(e);
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReachBottom:function () {
    console.log('上拉触底');
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
