// pages/AntiEpidemic/AntiEpidemic.js
import Utils from '../../../utils/utils'

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
        name: '填报任务',
        count: 0
      },
      {
        code: '2',
        name: '历史任务',
        count: 0
      },
      {
        code: '0',
        name: '全部任务',
        count: 0
      },
    ],
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = Utils.getUserInfo().userDepts; // 获取用户部门信息
    let depidList = [];
    userInfo.forEach(element => {
      depidList.push(element.deptId);
    });
    this.setData({
      depidList: depidList
    });
    this.getTaskList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  keywordChange(e) { // 搜索
    this.data.queryCond.keyword = e.detail.value
    // console.info(this.data.queryCond)
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
    that.getTaskList();
  },
  /**
   * 跳转至任务详情页
   */
  Taskdetail(e) {
    // console.info(e.currentTarget.dataset.itemdetail)
    const itemdetail = JSON.stringify(e.currentTarget.dataset.itemdetail);
    wx.navigateTo({
      url: '../AntiEpidemic-Taskdetails/AntiEpidemic-Taskdetails?itemdetail=' + itemdetail,
    })
  },
  /**
   * 获取任务列表
   */
  getTaskList() {
    let status_list = [];
    if (this.data.showTab == 1) // 根据当前任务状态调整传递的参数内容
      status_list = [1];
    else if (this.data.showTab == 2)
      status_list = [2, 3, 4];
    else
      status_list = [1, 2, 3, 4];

    var that = this;
    let objData = {
      statusList: status_list,
      deptId: that.data.depidList,
      current: that.data.current,
      pageSize: 10
    }
    console.log(objData);
    app.http.post('/assets/app/supplyTask/queryByParams', objData).then(data => {
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
    console.log('触底了')
    if (this.data.queryListData.length < this.data.current * 10) {
      return; // 判断是否还有后续的数据
    }
    let currentPage = this.data.current + 1
    this.setData({
      current: currentPage
    });
    this.getTaskList();
    console.log('触底了,加载新数据')
  }


})