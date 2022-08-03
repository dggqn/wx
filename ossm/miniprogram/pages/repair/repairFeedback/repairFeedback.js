// pages/repair/repairFeedback/repairFeedback.js
import Utils from '../../../utils/utils'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    haveValue: 'false', // 输入框中是否有输入的内容
    isSolve: 0,
    isSelected: 4, // 满意度选择
    SatisfactionText: '很满意', // 满意度文本
    Satisfaction: [{
      code: '0',
      text: '很差'
    }, {
      code: '1',
      text: '不满意'
    }, {
      code: '2',
      text: '一般'
    }, {
      code: '3',
      text: '满意'
    }, {
      code: '4',
      text: '很满意'
    }],
    issueTextarea: '', // 问题描述
    textArr: [], // 临时存放被选中的问题
    issueTextList: [{ //选择问题
      code: '0',
      active: false,
      text: '故障未查明'
    }, {
      code: '1',
      active: false,
      text: '维修员态度差'
    }, {
      code: '2',
      active: false,
      text: '未提前联系我'
    }, {
      code: '3',
      active: false,
      text: '未按时到达'
    }],
  },
  chooseSatisfaction(e) {
    let item = this.data.Satisfaction[e.currentTarget.dataset.code];
    this.setData({
      isSelected: item.code,
      SatisfactionText: item.text
    });
  },
  isOK(e) {
    this.setData({
      isSolve: e.currentTarget.dataset.ok
    })
  },
  chooseIssue(e) {
    let item = e.currentTarget.dataset.item;
    let bool = !this.data.issueTextList[item.code].active
    if (bool && (this.data.textArr.indexOf(item.text) < 0)) { //选择状态，且数组中没有该项则把该项添加到数组
      // console.log(item.text)
      this.data.textArr.push(item.text);
    } else { // 未选中状态则将其从数组中移除
      let arrIndex = this.data.textArr.indexOf(item.text); // 检索并获取该项的索引
      if (arrIndex > -1) { // 如果检索到该项，则将其移除
        this.data.textArr.splice(arrIndex, 1);
      }
    }
    this.data.issueTextList[item.code].active = bool; // 由于setdata中没法直接访问对象中的元素，所以先改变值再触发渲染
    // 以下是拼接问题，填入文本域中，但会覆盖用户输入内容
    let text = '';
    this.data.textArr.forEach(i => {
      text = text + i + '#';
    })
    console.log(text)
    this.setData({
      issueTextList: this.data.issueTextList,
      issueTextarea: text
    })
  },
  issueTextareaChange(e) {
    console.log(this.data.issueTextarea);
    this.data.issueTextarea = e.detail.value;
    if (this.data.issueTextarea.length > 0) {
      this.setData({
        haveValue: 'true'
      });
    } else {
      this.setData({
        haveValue: 'false'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let params = JSON.parse(options.params)
    this.setData({
      taskId: params.taskId,
      status: params.status
    })
  },
  submit(){
    let params = {}
    params.isSolve = this.data.isSolve
    params.isSelected = this.data.isSelected
    params.issueTextarea = this.data.issueTextarea
    let commitData = JSON.stringify(params)
    let req = {}
    req.comment = commitData
    req.taskId = this.data.taskId
    req.status = this.data.status
    // req.image = commitData
    console.log(req)
    app.http.post('/assets/app/task/appoint',req).then(data => {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
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