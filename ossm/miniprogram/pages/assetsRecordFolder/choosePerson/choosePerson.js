// pages/assetsInventory/chooseLeadingCadre/chooseLeadingCadre.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    radio:null,
    keyword:'',
    baseData:{}
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.search()
    wx.getStorage({
      key: 'changeOrderReceiver',
      success(res) {
        if (res.data) {
          that.setData({baseData:res.data})
        }
      }
    })
  },

  search(){
    app.http.get(app.env.assetsUrl + '/minapp/user/queryUserForCheckOrder?keyword=' +this.data.keyword).then(resp => {
      if (resp) {
        let userList=[]
        for (let i = 0; i < Object.keys(resp).length; i++) {
          if (this.data.baseData.selectedLiablePerson && this.data.baseData.selectedLiablePerson.entityId === resp[i].entityId) {
            this.setData({radio: i})
          }
          userList.push(resp[i]);
        }
        this.setData({userList:userList})
      } else {

      }
    })
  },
  changeKeyword(e){
    this.setData({keyword:e.detail.value})
  },
  confirm(){
    this.data.baseData.selectedLiablePerson=this.data.userList[this.data.radio]
    wx.setStorage({
      key: 'changeOrderReceiver',
      data: this.data.baseData,
      success: () => {
        wx.navigateBack({
          delta: -1
        })
      }
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

  },
})
