// pages/notice/noticeList/noticeList.js
import NoticeData from '../../../baseData/pages/notice/NoticeData'
import Utils from '../../../utils/utils'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    categoryName:'全部类型',
    messageMap: {
      receive_assets: {
        code: 'collar',
        name: '领用'
      },
      receive_become_invalid: {
        code: 'collar',
        name: '领用'
      },
      receive_invalided: {
        code: 'collar',
        name: '领用'
      },
      notification: {
        code: 'notification',
        name: '通告'
      },
      delivery_assets: {
        code: 'delivery_assets',
        name: '发货'
      },
      check_task: {
        code: 'check_task',
        name: '盘点'
      },
      submit_movement: {
        code: 'submit_movement',
        name: '调拨'
      },
      approval_results: {
        code: 'approval_results',
        name: '审批'
      },
      cancel_check_task: {
        code: 'cancel_check_task',
        name: '盘点',
      },
      approval_notice: {
        code: 'approval_notice',
        name: '审批',
      },
    },
    backgroundMap: {
      '领用': '#4CAF50',
      '通告': '#448AFF',
      '发货': '#00BCD4',
      '盘点': '#3F51B5',
      '调拨': '#FF5722',
      '审批': '#673AB7',
      'xxxx': '#CDDC39',
      '2424': '#FFC107',
      'xxxx2': '#FF9800',
      'xxxx4': '#795548',
      'xxxx5': '#C2185B',
      'xxxx7': '#03A9F4',
    },
    total:0,
    noticeList:[],
    queryCond:{
      size:10,
      current:1,
      categoryCode:'',
      readFlag:''
    },
    isLoadingFlag: true // 正在加载
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryMsgList();
    this.initMessageMapBackground();
  },
  initMessageMapBackground () {
    // for (let key of this.data.messageMap){
    //   this.data.messageMap[key].background = backgroundMap
    // }
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
  initCurrentAndQuery () {
    this.data.queryCond.current = 1
    this.setData({
      noticeList: []
    })
    this.queryMsgList()
  },
  selectTypes () {
    this.selectComponent('#type-down').setDropData(NoticeData.getNoticeType())
  },
  chooseType (e) {
    if(this.data.categoryName==e.detail.name){
      return
    }
    this.data.queryCond.categoryCode = ''
    this.data.queryCond.readFlag = ''
    this.setData({
      categoryName:e.detail.name
    })
    const code = e.detail.code;
    if(code=='readFlag_0'){
      this.data.queryCond.readFlag = '0'
    }else if(code=='readFlag_1'){
      this.data.queryCond.readFlag = '1'
    }else {
      this.data.queryCond.categoryCode = e.detail.code
    }
    this.initCurrentAndQuery();
  },

  goNoticeDetail (e) {
    //一种跳转单据.一种显示详情
    const item = this.data.noticeList[parseInt(e.currentTarget.dataset.index)]

    const noticeExtend = JSON.parse(item.noticeExtend);
    let maUrlInfo = noticeExtend.maUrl;
    if(maUrlInfo==null || maUrlInfo==undefined){
      maUrlInfo = {}
    }

    //标记为已读
    if(item.readFlag != '1'){
      const reqUrl = app.env.assetsUrl
          + `/minapp/msg/readSiteMsg?noticeId=${item.entityId}`
      app.http.get(reqUrl).then(data => {
        item.readFlag = '1'
        this.setData({
          noticeList: this.data.noticeList
        })
      })
    }
    if(maUrlInfo.navigateType=='outSite'){
      wx.navigateTo({
        url: '/pages/outSite/outSite?url='+maUrlInfo.url,
      })
    }
    else if(maUrlInfo.navigateType=='custom'){
      wx.navigateTo({
        url: maUrlInfo.url,
      })
    }
    else {
      //详情
      wx.navigateTo({
        url: '/pages/notice/noticeDetail/noticeDetail?notice='+encodeURIComponent(JSON.stringify(item)),
      })
    }
  },
  /**
   * 全部已读
   */
  readMsg () {
    const allRead = this.data.noticeList.every(item => item.readFlag === '1')
    if (allRead) {
      wx.showToast({
        title: '当前没有未读消息',
        icon: 'none'
      })
      return
    }
    app.http.post(app.env.assetsUrl + '/minapp/msg/batchReadNotice', {}).then(data => {
      this.initCurrentAndQuery()
    })
  },
  /**
   * 查询消息
   */
  queryMsgList () {
    //查询通知
    const queryCond = {...this.data.queryCond}
    if(this.data.queryCond.current != 1 && this.data.total<=this.data.noticeList.length){
      return
    }
    this.setData({
      isLoadingFlag: true
    })
    app.http.post(app.env.assetsUrl + '/minapp/msg/queryMyMsg', queryCond, {}).then(data => {
      this.setData({
        isLoadingFlag: false,
      })
      this.data.total = data.total
      if (this.data.queryCond.current == 1) {
        this.setData({
          noticeList: data.records
        })
      }else {
        if (data.records.length<=0) {
          wx.showToast({
            title: '已经到底了',
            icon: 'none'
          })
        }else {
          this.setData({
            noticeList: this.data.noticeList.concat(data.records)
          })
        }
      }
    })
  },
  bindscrolltolower () {
    if (this.isLoadingFlag || this.data.total <= this.data.noticeList.length) {
      return
    }
    this.data.queryCond.current++
    this.queryMsgList()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
