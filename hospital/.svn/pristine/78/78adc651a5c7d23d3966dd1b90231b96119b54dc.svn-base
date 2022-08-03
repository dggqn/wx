// miniprogram/pages/address/addOrModifyAddress/addOrModifyAddress.js
import Utils from "../../../utils/utils";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    areas: '请选择',
    entityId: null,
    saving: false,
    address: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const operate = options.operate // add或者modify
    const entityId = options.entityId
    if (entityId) {
      this.setData({
        entityId: entityId
      })
    }
    this.setNavTitle(operate);
    this.getAddressDetail(operate)
  },
  setNavTitle (operate) {
    wx.setNavigationBarTitle({
      title: operate === 'add' ? '新增收货地址' : '修改收货地址'
    })
  },
  getAddressDetail (operate) {
    const setDefaultAddressCode = () => {
      const address = this.data.address
      if (address.addrCodeChn) {
        return
      }
      address.addrChn = ['上海市','上海市','黄浦区'];
      address.addrCodeChn = '上海市-上海市-黄浦区'
      address.zip = '200001'
      address.addrCode = '310000-310100-310101'
      address.tel = ''
      address.addrInfo = ''
      address.name = ''
      address.defaultFlag = false
      this.setData({
        address: address
      })
    }
    if (operate === 'add') {
      setDefaultAddressCode()
      return
    }
    // 获取地址详情
    app.http.post(app.env.assetsUrl + '/minapp/addr/get',  {entityId: this.data.entityId}, {}).then(resp => {
      this.setData({
        address: resp
      })
      // 如果省市区缺失设置默认
      setDefaultAddressCode()
    })
  },
  /**
   * 新增或更新
   */
  updateOrInsertAddress() {
    // 非空校验
    const address = {...this.data.address}
    const notEmptyMsg = {
      name: '请填写联系人',
      tel: '请填写手机号',
      addrCodeChn: '请选择所在地区',
      addrInfo: '请填写详细地址'
    }
    if(!address.name){
      wx.showToast({ title: notEmptyMsg.name, icon: 'none' });
      return
    }
    if(!address.tel){
      wx.showToast({ title: notEmptyMsg.tel, icon: 'none' });
      return
    }
    if(!address.addrCodeChn){
      wx.showToast({ title: notEmptyMsg.addrCodeChn, icon: 'none' });
      return
    }
    if(!address.addrInfo){
      wx.showToast({ title: notEmptyMsg.addrInfo, icon: 'none' });
      return
    }
    
    // 更新或新增
    const insertOrUpdate = () => {
      address.ownerType = "user"
      address.defaultFlag = (address.defaultFlag === true || address.defaultFlag === '1') ? "1" : "0"
      wx.showLoading({mask:true})
      app.http.post(app.env.assetsUrl + '/minapp/addr/insertOrUpdate', address, {}).then(resp => {
        wx.hideLoading()
        wx.showToast({title: "操作成功",mask:true})
        this.setData({
          entityId: resp
        })
        // wx.navigateBack({delta: 1})
        setTimeout(()=>{
          wx.navigateBack({delta: 1})
        },1000)
        setTimeout(()=>{
          this.data.saving = false
        },2000)
      });
    }
    if(!this.data.saving){
      this.data.saving = true
      insertOrUpdate()
    }
  },
  /**
   * input事件实现所有输入属性的双向绑定
   * @param e
   */
  bindInput(e) {
    const type = e.currentTarget.dataset.type
    const address = this.data.address
    address[type] = e.detail.value
    if (type === 'addrCodeChn' && e.detail.value) {
      address[type] = e.detail.value.join('-')
      address.addrChn = e.detail.value
      address.zip = e.detail.postcode
      address.addrCode = e.detail.code.join('-')
    }
    this.setData({
      address: address
    });
  },
  /**
   * 开关change事件
   */
  switchChange(e) {
    const address = this.data.address
    address.defaultFlag = e.detail.value
    this.setData({
      address: address
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
