// pages/repair/RepairmanPage/RepairOrder/RepairOrder.js
import Utils from '../../../utils/utils'
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    tab: 1,
  },
  goAddDetail(e) {
    wx.navigateTo({
      url: '/pages/repair/repairDeclare/repairDeclare',
    })
  },
  goDetail(e) {
    let submitType = e.currentTarget.dataset.type
    let detail = e.currentTarget.dataset.itemdetail;
    let detailStr = JSON.stringify(e.currentTarget.dataset.itemdetail);
    console.log(detailStr);
    if(submitType == 'btn0'){
      wx.navigateTo({
        url: '/pages/repair/repairDeclare/repairDeclare?itemDetail=' + detailStr,
      })
    }else if(submitType == 'btn1'){
      wx.navigateTo({
        url: '/pages/repair/MemberList/MemberList?id=' + detail.taskId,
      })
    }else if(submitType == 'btninfo'){
      wx.navigateTo({
        url: '/pages/repair/repairDetail/repairDetail?itemDetail=' + detailStr,
      })
    }else if(submitType == 'btn4'){
      let params = {}
      params.status = '5'
      params.taskId = detail.taskId
      let paramsStr = JSON.stringify(params);
      wx.navigateTo({
        url: '/pages/repair/repairPoint/repairPoint?params=' + paramsStr,
      })
    }else if(submitType == 'btn5'){
      let params = {}
      params.status = '7'
      params.taskId = detail.taskId
      let paramsStr = JSON.stringify(params);
      wx.navigateTo({
        url: '/pages/repair/repairFeedback/repairFeedback?params=' + paramsStr,
      })
    }else if(submitType == 'btnClose'){
      let params = {}
      params.status = '6'
      params.taskId = detail.taskId
      let paramsStr = JSON.stringify(params);
      wx.navigateTo({
        url: '/pages/repair/repairPoint/repairPoint?params=' + paramsStr,
      })
    }
  },
  changeTab(e) {
    if (this.data.showTab == e.currentTarget.dataset.tab) {
      return;
    }
    let that = this;
    this.setData({
      showTab: e.currentTarget.dataset.tab,
      current: 1,
    });
    let tab = e.currentTarget.dataset.tab
    this.setData({
      tab: tab
    })
    if(tab=='1'){ 
      that.setData({
        repairList: this.data.repairListAll
      })
    }else if(tab=='2'){
      that.setData({
        repairList: this.data.repairList2
      })
    }else if(tab=='3'){
      that.setData({
        repairList: this.data.repairList3
      })
    }else if(tab=='4'){
      that.setData({
        repairList: this.data.repairList4
      })
    }else if(tab=='5'){
      that.setData({
        repairList: this.data.repairList5
      })
    }else if(tab=='6'){
      that.setData({
        repairList: this.data.repairList6
      })
    }
  },
  /**
   * 获取报修单列表
   */
  getPepairOrder() {
    this.setData({
      showTab: 1,
      current: 1,
    });
    this.setData({
      tab: 1
    });
    let that = this;
    let info = this.data.userInfo
    console.log({
      'userId': info.userId, //用户id
      'deptId': info.userDepts[0].deptId, //部门id
      'userIdentity': info.userIdentity, //是否上级
      'current': 1,
      'pageSize': 10
    })
    console.log(Utils.getUserInfo().isWsy)
    let reqData = {}
    if(Utils.getUserInfo().isWxy){
      if(info.userIdentity == '2'){
        this.setData({
          userLevel: 2
        })
        reqData = {
          isApp: '1',
          serviceTeam: info.userDepts[0].deptId //部门id
        }
      }else{
        this.setData({
          userLevel: 1
        })
        reqData = {
          isApp: '1',
          workerUser: info.userId //维修员id
        }
      }
    }else{
      this.setData({
        userLevel: 0
      })
      reqData = {
        isApp: '1',
        userId: info.userId //普通员工id
      }
    }
    app.http.post('/assets/app/task/query', reqData).then(data => {
      let listcountAll = 0
      let repairListAll = []
      let listcount2 = 0
      let repairList2 = []
      let listcount3 = 0
      let repairList3 = []
      let listcount4 = 0
      let repairList4 = []
      let listcount5 = 0
      let repairList5 = []
      let listcount6 = 0
      let repairList6 = []
      console.log(data.records)
      for(let i =0;i<data.records.length;i++){
        let record = data.records[i]
        if(record.image){
          record.imageUrl = record.image.split("||")[0]
        }
        if(record.status=='2' &&  info.userId == record.workerUser){
          record.isSelf = true
        }else{
          record.isSelf = false
        }

        listcountAll ++
        repairListAll.push(record)
        if(record.status=='1'){
          listcount2++
          repairList2.push(record)
        }else if(record.status=='2'){
          listcount3++
          repairList3.push(record)
        }else if(record.status=='3' || record.status=='4'){
          listcount4++
          repairList4.push(record)
        }else if(record.status=='5'){
          listcount5++
          repairList5.push(record)
        }else if(record.status=='7'){
          listcount6++
          repairList6.push(record)
        }
      }
      this.setData({
        listcountAll: listcountAll,
        listcount2: listcount2,
        listcount3: listcount3,
        listcount4: listcount4,
        listcount5: listcount5,
        listcount6: listcount6
      })
      this.setData({
        repairList: repairListAll,
        repairListAll: repairListAll,
        repairList2: repairList2,
        repairList3: repairList3,
        repairList4: repairList4,
        repairList5: repairList5,
        repairList6: repairList6
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Utils.getUserInfo())
    this.setData({
      userInfo: Utils.getUserInfo()
    })
    this.getPepairOrder()
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
    this.getPepairOrder()
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
  onPullDownRefresh:function(){
    this.getPepairOrder()
    // 开启下拉刷新
    setTimeout(()=>{
      // 关闭下拉刷新
      wx.stopPullDownRefresh()
    },1500)
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