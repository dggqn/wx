// pages/AntiEpidemicPages/DistributionPage/Distribution-ApplyList/Distribution-ApplyList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 确认签收人弹窗是否显示
    dialog_Name: false,
    // 确认结束任务弹窗是否显示
    dialog_Finish: false,
    Receiver: '', // 签收人名称
    Address: '', // 签收地址提示
    Goods: '', // 签收物品提示
    entityId: '', // 确认签收传递的id
    Task_entityId: '', // 任务的id
    queryListData: [],
    current: 1,
  },
  /**
   * 获取配送列表
   */
  getDistributionList(callback) {
    var that = this;
    app.http.post('/assets/app/supplyApplication/query', {
      taskId: that.data.Task_entityId,
      current: that.data.current,
      pageSize: 10
    }).then(data => {
      console.info(data);
      let ListData = [];
      console.log(data.records);
      console.log(that.data.queryListData);
      // 深拷贝-只适用一层数据的情况
      ListData = that.data.queryListData.concat(data.records).concat();
      // ListData.push(...data.records);
      console.log(ListData);

      that.setData({
        queryListData: ListData
      })
      console.log(that.data.queryListData); // ListData
      console.log('queryListData数据填充完成'); // ListData
      console.log(callback)
      if (callback) {
        this.checkTaskEed();
        console.log('执行callback')
      }
    })
  },
  /**
   * 滑动触底
   */
  onReachBottom() {
    console.log(this.data.queryListData.length)
    console.log(this.data.current)

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

  // 确认签收人弹窗
  showDialog(e) {
    console.log(e.target.dataset.itemdetail)
    let goods = this.data.supplyName + ' * ' + e.target.dataset.itemdetail.amount
    let address = e.target.dataset.itemdetail.deptName + "-" + e.target.dataset.itemdetail.reAddress
    this.setData({
      Receiver: e.target.dataset.itemdetail.linkman,
      Address: address,
      Goods: goods,
      entityId: e.target.dataset.itemdetail.entityId,
      dialog_Name: true,
    });
  },
  onNameClose() {
    console.log('nameclose');
    this.setData({
      dialog_Name: false,
    });
  },
  onClose() {
    console.log('close');
    this.setData({
      dialog_Name: false,
      dialog_Finish: false
    });
    // 重定向到当前页面
    // wx.redirectTo({
    //   url: '../Distribution-ApplyList/Distribution-ApplyList?itemDetail=' + this.data.options_itemDetail,
    // })
  },
  /**
   * 配送员确认签收
   */
  Sign() {
    var that = this;
    console.log(that.data.Receiver)
    if (!that.data.Receiver) {
      wx.showToast({
        title: '请填写签收人',
        icon: 'none',
        duration: 1000
      });
    }

    app.http.post('/assets/app/supplyApplication/received', {
      entityId: that.data.entityId,
      receiverPerson: that.data.Receiver
    }).then(data => {
      wx.showToast({
        title: '签收成功',
        icon: 'success',
        duration: 1000
      });
      setTimeout(function () {

        // 重定向到当前页面
        wx.redirectTo({
          url: '../Distribution-ApplyList/Distribution-ApplyList?itemDetail=' + that.data.options_itemDetail,
        })
      }, 1001);
    })
  },
  show_dialog_Finish() {
    this.setData({
      dialog_Finish: true
    });
  },
  /**
   * 用户点击“结束任务”按钮
   */
  Finish() {
    let isFinish = this.checkTaskEed();
    console.log(isFinish);
    if (!isFinish) {
      wx.showToast({
        title: '仍有科室未签收，不能结束任务！',
        icon: 'none',
      });
    }
  },
  /**
   * 配送员结束任务
   */
  FinishTask() {
    var that = this;
    console.log(that.data.Task_entityId)
    app.http.post('/assets/app/supplyTask/received', {
      entityId: that.data.Task_entityId,
    }).then(data => {
      wx.showToast({
        title: '已成功任务结束',
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
   * 检查该任务是否已完成所有配送工作
   */
  checkTaskEed() {
    let that = this;
    console.log(that.data.queryListData)
    console.log(that.data.queryListData.length)
    //先检查当前是至少有一项，判断第一项是否被签收
    console.log(that.data.queryListData.length > 0)
    if (that.data.queryListData.length > 0) {
      if ('receiverTime' in that.data.queryListData[0] && 'receiverPerson' in that.data.queryListData[0]) {
        console.log('receiverTime和receiverPerson属性存在')
        if (that.data.queryListData[0].receiverTime && that.data.queryListData[0].receiverPerson) {
          that.show_dialog_Finish();
          return 1;
        }
      } else {
        console.log('！不存在receiverTime和receiverPerson属性');
        return 0;
      }
    } else {
      console.log('该任务没有配送项')
      that.show_dialog_Finish();
      return 1;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载')
    console.log(options.itemDetail)
    this.data.options_itemDetail = options.itemDetail;
    let itemDetail = JSON.parse(options.itemDetail);
    itemDetail = itemDetail.itemdetail;
    console.log(itemDetail);
    this.data.Task_entityId = itemDetail.entityId;
    this.setData({
      // status: itemDetail.status,
      supplyName: itemDetail.supplyName,
      TaskStatus: itemDetail.status
    });
    if (itemDetail.status == 3) {
      this.getDistributionList(1);
    } else {
      this.getDistributionList(0);
    }
    wx.setNavigationBarTitle({
      title: itemDetail.taskName,
    });

  },
  /**
   * 监听页面显示
   */
  onShow: function (options) {
    console.log('页面显示')
    // this.checkTaskEed();
  },


})