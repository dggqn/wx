// pages/AntiEpidemicPages/AntiEpidemic-Taskdetails/AntiEpidemic-Taskdetails.js
import Utils from '../../../utils/utils'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    taskDetail: {},
    submitObj: {},
    Submit_UserInfo: {},
    Submit_quantity: 1 ,//数量
    pageType:true //标识当前页面：详情false 提交&编辑true
  },
  /**
   * 修改申领数量
   */
  onChange(event) {
    this.setData({
      Submit_quantity: event.detail
    });
  },
  /**
   * 提交申请
   */
  submitApplyInsert() {
    const ObjData = {
      taskId: this.data.taskDetail.entityId,
      amount: this.data.Submit_quantity,
      deptId: this.data.Submit_UserInfo.deptId,
      linkman: this.data.Submit_UserInfo.linkman,
      linktel: this.data.Submit_UserInfo.linktel,
      creator: this.data.Submit_UserInfo.userId,
      deptName: this.data.Submit_UserInfo.deptName,
      taskName: this.data.taskDetail.name,
      reAddress: this.data.Submit_UserInfo.reAddress,
      reRemark: this.data.Submit_UserInfo.reRemark,
    };
    var that = this;
    for(var v in ObjData){
      // console.log(v,":",ObjData[v]);
      if(!ObjData[v] && v != 'reRemark') {
        wx.showToast({
          title: '请先完成填写',
          icon: 'none',
        });
        return;
      }
    };

    app.http.post('/assets/app/supplyApplication/insert', ObjData).then(data => {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 1001);
    })
  },
  /**
   * 转跳至申领页
   * @param {*} e 
   */
  submitApply(e) {
    const Detail = JSON.stringify(this.data.taskDetail);
    wx.navigateTo({
      url: '../AntiEpidemic-Submit/AntiEpidemic-Submit?act=insert&taskDetail=' + Detail,
    })
  },
  /**
   * 转跳至填报记录
   * @param {*} e 
   */
  submitList(e) {
    const Detail = JSON.stringify(this.data.taskDetail);
    wx.navigateTo({
      url: '../AntiEpidemic-applyList/AntiEpidemic-applyList?Detail=' + Detail,
    })
  },
  commomCountChange(e) {
    console.info(e.currentTarget.dataset.count)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const itemdetail = JSON.parse(options.itemdetail) // 任务详情: 继承前一个页面的任务信息，用于向后端传参
    console.info(itemdetail)
    let userInfo = Utils.getUserInfo(); // 获取用户信息，用于自动填写表单
    // 因为数据来源不同所以需要统一字段名,以便后续做修改用
    userInfo.linkman = userInfo.realName;
    userInfo.linktel = userInfo.userMobile;
    userInfo.deptName = userInfo.userDepts[0].deptName;
    userInfo.deptId = userInfo.userDepts[0].deptId;
    console.warn(userInfo);
    console.warn(this.data.Submit_UserInfo.reAddress);

    this.setData({
      Submit_UserInfo: userInfo,
      taskDetail: itemdetail,
    });

  },
  /**/
  deptNameChange(e) {
    this.data.Submit_UserInfo.deptName = e.detail;
  },
  linkmanChange(e) {
    this.data.Submit_UserInfo.linkman = e.detail;
  },
  linktelChange(e) {
    this.data.Submit_UserInfo.linktel = e.detail;
  },
  addressChange(e) {
    this.data.Submit_UserInfo.reAddress = e.detail;
  },
  remarksChange(e) {
    this.data.Submit_UserInfo.reRemark = e.detail;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

})