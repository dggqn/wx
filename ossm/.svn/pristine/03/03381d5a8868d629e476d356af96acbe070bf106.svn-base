// pages/AntiEpidemicPages/DistributionPage/Distribution-TaskList/Distribution-TaskList.js
import Utils from '../../../../utils/utils'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    queryListData: [],
    showTab: '1',
    isComplete: false, // 是否完成第一次加载
    tabList: [{
        code: '1',
        name: '待配送',
        count: 0
      },
      {
        code: '0',
        name: '已完成',
        count: 0
      },
      {
        code: '2',
        name: '全部',
        count: 0
      },
    ],
    current: 1,
  },
  /**
   * 跳转至申请列表
   * @param {*} options 
   */
  ApplyList(e) {
    console.log(e.currentTarget.dataset)
    const Detail = JSON.stringify(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../Distribution-ApplyList/Distribution-ApplyList?itemDetail=' + Detail,
    })
  },
  /**
   * tab栏切换事件
   * @param {*} e 
   */
  changeTab: function (e) {
    if (this.data.showTab == e.currentTarget.dataset.tab) {
      return;
    }
    let that = this;
    this.setData({
      showTab: e.currentTarget.dataset.tab,
      current: 1,
    });
    this.data.queryListData = [];
    that.getDistributionList();
  },


  /**
   * 获取任务列表
   */
  getDistributionList() {
    let status_list = [];
    if (this.data.showTab == 1) // 根据当前任务状态调整传递的参数内容
      status_list = [3];
    else if (this.data.showTab == 0)
      status_list = [4]
    else
      status_list = [3, 4]

    var that = this;
    app.http.post('/assets/app/supplyTask/queryByRole', {
      statusList: status_list,
      current: that.data.current,
      pageSize: 10
    }).then(data => {
      console.info(data);
      let ListData = [];
      ListData = that.data.queryListData;
      ListData.push(...data.records);
      console.log(ListData); // ListData
      that.setData({
        queryListData: ListData
      })

    })
  },
  /**
   * 滑动触底
   */
  onReachBottom() {
    if (this.data.queryListData.length < this.data.current * 10) {
      return; // 判断是否还有后续的数据
    }
    let currentPage = this.data.current + 1
    this.setData({
      current: currentPage
    });
    this.getDistributionList();
    console.log('触底了,加载新数据')
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load触发')
    // this.setData({
    //   queryListData: []
    // })
    // this.getDistributionList();
  },
  onShow: function (options) {
    console.log('show触发')
    this.setData({
      queryListData: []
    })
    this.getDistributionList();
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


})