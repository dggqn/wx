// pages/AntiEpidemicPages/AntiEpidemic-Submit/AntiEpidemic-Submit.js
import Utils from '../../../utils/utils'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Submit_UserInfo: {},
    Submit_quantity: 1 //数量
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
   * 判断请求是"提交申请"或"保存"
   */
  submitApply() {
    console.log(this.data.action_type)
    if (this.data.action_type == 'insert') {
      this.submitApplyInsert();
    } else if (this.data.action_type == 'update') {
      this.submitApplyUpdate();
    }
  },
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
  // *申领功能逻辑-star*


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
    app.http.post('/assets/app/supplyApplication/insert', ObjData).then(data => {
      console.info(data);
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 2
        });
      }, 1001);
    })
  },


  // *申领功能逻辑-end*

  // *编辑功能逻辑-star*


  /**
   * 编辑申请-保存
   */
  submitApplyUpdate() {
    const ObjData = {
      entityId: this.data.Submit_UserInfo.entityId,
      taskId: this.data.Submit_UserInfo.taskId,
      amount: this.data.Submit_quantity,
      deptId: this.data.Submit_UserInfo.deptId,
      linkman: this.data.Submit_UserInfo.linkman,
      linktel: this.data.Submit_UserInfo.linktel,
      // creator: this.data.Submit_UserInfo.creator,
      deptName: this.data.Submit_UserInfo.deptName,
      taskName: this.data.Submit_UserInfo.taskName,
      reAddress: this.data.Submit_UserInfo.reAddress,
      reRemark: this.data.Submit_UserInfo.reRemark,
    }
    console.log(ObjData)
    for (var v in ObjData) {
      console.log(v, ":", ObjData[v]);
      if (!ObjData[v] && v != 'reRemark') {
        wx.showToast({
          title: '请先完成填写',
          icon: 'none',
        });
        return;
      }
    };

    app.http.post('/assets/app/supplyApplication/update', ObjData).then(data => {
      console.info(data);
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


  // *编辑功能逻辑-end*

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.act == 'insert') {
      let userInfo = Utils.getUserInfo(); // 获取用户信息，用于自动填写表单
      const taskDetail = JSON.parse(options.taskDetail); // 继承前一个页面的任务信息，用于向后端传参
      // console.info(taskDetail);
      // 因为数据来源不同所以需要统一字段名,以便后续做修改用
      userInfo.linkman = userInfo.realName;
      userInfo.linktel = userInfo.userMobile;
      userInfo.deptName = userInfo.userDepts[0].deptName;
      userInfo.deptId = userInfo.userDepts[0].deptId;
      console.warn(userInfo);
      this.setData({
        Submit_UserInfo: userInfo,
        taskDetail: taskDetail,
        action_type: options.act,
      });
    }

    if (options.act == 'update') {
      const TaskDataObj = JSON.parse(options.itemData);
      console.warn(TaskDataObj)
      this.setData({
        Submit_UserInfo: TaskDataObj, // 任务详情
        Submit_quantity: TaskDataObj.amount,
        action_type: options.act,
        edit_description: options.description,
        edit_supplyName: options.supplyName
      })
    }

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

})