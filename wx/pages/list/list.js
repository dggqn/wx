// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a:'a',
    b:'b',
    c:'c',
    country:'CHINA',
    arr1:['小米','华为','苹果'],
    userList:[
      {id:1,name:'xh'},
      {id:2,name:'xb'},
      {id:3,name:'xz'}
    ],
    count:0
  },

  sendRequest(){
    wx.request({
      url: 'https://www.escook.cn/api/get',
      method:'GET',
      data:{
        name:'zs',
        age:18
      },
      success:(res)=>{
        console.log(res.data);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    console.log('下拉刷新');
    this.setData({
      count:0
    })
    wx.stopPullDownRefresh()
  },
  add(){
    this.setData({
      count:this.data.count + 1
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('上拉刷新');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})