// pages/applyPages/applyRes/updateApply/updateApply.js

import {canIUseModel} from '../../../@vant/weapp/common/version'
import Utils from '../../../utils/utils'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    applyList:[1,2,3,4],
    showList:[],
    applyReason:'',
    saving:false,
    selectAddressModal: false,
    addressList: [],
    defaultAddress: null
  },
  // 选择地址
  chooseAddress () {
    this.setData({
      selectAddressModal: true
    })
  },
  // 关闭选择地址
  closeAddressModal () {
    this.setData({
      selectAddressModal: false
    })
  },
  // 获取地址列表
  getAddressList () {
    const defaultAddress = this.data.defaultAddress
    app.http.post(app.env.assetsUrl + '/minapp/addr/myAddress',  {ownerType: 'user'}, {}).then(data => {
      if(data && data.length > 0){
        for(let a of data){
          // 如果有默认的 选中
          if(a.defaultFlag == '1'){
            this.setData({
              defaultAddress: a
            });
          }
          // 如果已有选择的 默认选中该选项 优先级较高
          if (defaultAddress && defaultAddress.entityId == a.entityId) {
            this.setData({
              defaultAddress: a
            });
          }
        }
      }
      // 设置list
      this.setData({
        addressList: data
      })
    })
  },
  // 新增地址
  addAddress () {
    wx.navigateTo({
      url: '/pages/address/addOrModifyAddress/addOrModifyAddress?operate=add',
    })
  },
  changeDefaultAddress(e){
    const address = e.detail.item
    const selectedId = address.entityId
    const items = this.data.addressList
    for (let i = 0, len = items.length; i < len; ++i) {
      const item = items[i]
      item.checked = false
      if(item.entityId === selectedId){
        item.checked = true
        this.setData({
          defaultAddress: item
        })
      }
    }
    this.setData({
      addressList: items
    })
    // 选中后关闭弹窗
    this.closeAddressModal()
  },
  viewValueChange (e) {
    if(e.currentTarget.dataset.path){
      const pathArray = e.currentTarget.dataset.path.split(".")
      const length = pathArray.length
      let aimObj = this.data
      for (var i = 0; i < length-1; i++) {
        aimObj = aimObj[pathArray[i]]
      }
      let value = e.detail.value
      let sync = false
      if(e.currentTarget.dataset.minvalue){
        if(parseInt(e.currentTarget.dataset.minvalue)>parseInt(value)){
          value = parseInt(e.currentTarget.dataset.minvalue)
          sync = true
        }
      }
      aimObj[pathArray[length-1]] = value
      if(sync){
        const syncData = {}
        syncData[pathArray[0]] = this.data[pathArray[0]]
        this.setData(syncData)
      }
    }
  },
  showAll () {
    this.setData({
      applyList: this.data.applyList,
      showList: this.data.applyList
    })
  },
  // 提交前
  subscribeMessage() {
    wx.requestSubscribeMessage({
      tmplIds: [
        '0tf_x8-88R9LiQtD-kGa35sNYr9aaQypoDhqhbJkL4I', //领用通知
        // 'VaYdBoTz1psXv95w71N4bFE8RoUX8CTpoWUEKE7v7bg', //取消申领
        // '1h3BWMig8ywk8mUSIQhb_UMRhecAJ1TG7rMiffriyKw', //领用单失效通知
        'yWV1AveWW_Fo3MJ79sRQDG-V-pn3IgciXn7enhYybrQ', //签收通知
        'XXSKLBeNGbq6ElhiBTkEdfpZ7bIiFAF21bAm3VItbIM' //供应商发货通知
      ],
      complete: function (resp) {
        console.info('订阅消息返回:' + JSON.stringify(resp))
        if (resp.errCode == '20004') {
          wx.showModal({
            title: '消息订阅失败',
            icon: 'none',
            content: '请在设置中打开消息订阅开关',
          })
        }
      }
    })
  },
  submitApply () {
    if(!this.data.defaultAddress){
      wx.showToast({ title: '请选择收货地址', icon: 'none' })
      return
    }
    const snapAddress = {... this.data.defaultAddress}
      // 原地址id
      snapAddress.addrInfoId = this.data.defaultAddress.entityId
      // 置空entityId
      snapAddress.entityId = ''
    const reqData = {
      remark: this.data.applyReason,
      detailList: [],
      addrInfo: snapAddress
    }
    for (var i = 0; i < this.data.applyList.length; i++) {
      const item = this.data.applyList[i]
      reqData.detailList.push({
        ...item,
        modelId: item.entityId
      })
    }
    if(!this.data.saving){
      this.data.saving = true
      app.http.post(app.env.assetsUrl + '/minapp/apply/addOrders', reqData, {}).then(data => {
        // wx.showToast({ title: '申请成功,在仓库管理员页面可见', icon: 'none' });
        // wx.setStorageSync('clear_production',1);
        wx.removeStorageSync('carData')
        wx.setStorageSync('clear_car',1);
        //地址跳转（跳转到申领成功页）
        wx.redirectTo({
          url: '/pages/applyPages/applySuccess/applySuccess?entityId='+data,
        })
      })
      setTimeout(() => {
        this.data.saving = false
      }, 11000);
    }else {
      wx.showToast({ title: '提交申请中...', icon: 'none' });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.applyList = JSON.parse(decodeURIComponent(options.applyList))
    let showCount = 2
    if(showCount > this.data.applyList.length){
      showCount = this.data.applyList.length
    }
    for (var i = 0; i < showCount; i++) {
      this.data.showList.push(this.data.applyList[i])
    }
    this.showAll();
    this.setData({
      applyList: this.data.applyList,
      showList: this.data.showList
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
    this.getAddressList()
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
