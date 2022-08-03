// miniprogram/pages/assetsRecordFolder/assetsChange/assetsChange.js
import Utils from '../../../utils/utils'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    userName: '',
    fixedList: '',
    receiver: {
      id: '',
      name: ''
    },
    remark: '',
    assetsType:String
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({assetsType:options.type})
    if(options.type === 'change'){
      wx.setNavigationBarTitle({
        title: '资产变更',
      })
    }else if(options.type === 'scrap'){
      wx.setNavigationBarTitle({
        title: '资产报废',
      })

    }
    const user = Utils.getUserInfo();
    this.setData({userName: user.realName})
    this.setData({fixedList: JSON.parse(options.list)})
  },

  applySubmit() {
    if(this.data.assetsType !== 'scrap'){
      if (!this.data.receiver.id) return wx.showToast({title: '请选择接收人', icon: "none"})
      if (!this.data.remark) return wx.showToast({title: '请选择填写变更说明', icon: "none"})
      this.submit()
    }else{
      if (!this.data.remark) return wx.showToast({title: '请选择填写报废理由', icon: "none"})
      this.submitScrap()
    }
    
    
  },
  submitScrap(){
    if (this.data.remark && this.data.remark.length > 50) {
      wx.showToast({title:'报废理由不能超过50个字', icon: "none"})
      return
    }
    const req = {
      reason:this.data.remark,
      status:'wait_approval',
      fixedList:this.data.fixedList
    };
    app.http.post(app.env.assetsUrl + '/minapp/ordersScrap/apply', req).then(resp => {
      wx.navigateTo({
        url: `../submitChanges/submitChanges?entityId=${resp}&type=报废`
      })
    })
  },
  submit() {
    if (this.data.remark && this.data.remark.length > 50) {
      wx.showToast({title:'变更说明不能超过50个字', icon: "none"})
      return
    }
    const req = {
      remark: this.data.remark,
      status: 'wait_approval',
      receiveUid: this.data.receiver.id,
      fixedList: this.data.fixedList
    };
    app.http.post(app.env.assetsUrl + '/minapp/ordersChange/apply', req).then(resp => {
      wx.navigateTo({
        url: `../submitChanges/submitChanges?entityId=${resp}&type=变更`
      })
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
    const storageInfo = wx.getStorageSync('changeOrderReceiver')
    if (storageInfo) {
      const user = storageInfo.selectedLiablePerson
      this.setData({receiver: {id: user.entityId, name: user.realname}})
    }
  },

  changeKeyword(e){
    this.setData({remark:e.detail.value})
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
