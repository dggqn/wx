// pages/AntiEpidemicPages/AntiEpidemic-applyList/AntiEpidemic-applyList.js
import Utils from '../../../utils/utils'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ApplyList: [],
    isLoadingFlag: true,
    current: 1,
  },
  goApplyDetail(e) {
    console.log(this.data.statuss)
    if (this.data.status == 1) {
      const itemData = JSON.stringify(e.currentTarget.dataset.itemdetail)
      wx.navigateTo({
        url: '../AntiEpidemic-Submit/AntiEpidemic-Submit?act=update&itemData=' + itemData + '&description=' + this.data.description + '&supplyName=' + this.data.supplyName,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const taskDetail = JSON.parse(options.Detail)
    console.log(taskDetail)
    const UserInfo = Utils.getUserInfo(); // 从缓存从读取用户信息
    this.setData({
      userInfo: UserInfo,
      taskId: taskDetail.entityId, //任务ID
      description: taskDetail.description, // 任务描述
      supplyName: taskDetail.supplyName, //物资名称
      status: taskDetail.status // 是否截止
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSupplyApplicationList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.warn('触底了')

  },
  /**
   * 获取填报记录列表
   * 
   */
  getSupplyApplicationList() {
    var that = this;
    const ObjData = {
      taskId: this.data.taskId,
      creator: this.data.userInfo.userId,
      current: this.data.current,
      pageSize: 10
    };
    app.http.post('/assets/app/supplyApplication/query', ObjData).then(data => {
      console.info(data.records);
      that.setData({
        isLoadingFlag: false,
        SupplyApplicationList: data.records
      })
    })
  },

})