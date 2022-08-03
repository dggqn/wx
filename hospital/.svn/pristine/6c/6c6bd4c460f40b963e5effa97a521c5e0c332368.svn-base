import ScanAnalysisUtils from '../../../utils/scanAnalysisUtils'
import utils from '../../../utils/utils'

const {
  default: Utils
} = require("../../../utils/utils")
var app = getApp()
// pages/index/apply/apply.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    userInfo: {},
    userDeptNames: '',
    bannerList: [],
    applyList: [],
    msgList: [],
    latestMsg: {},
    showDialog: false,
    isLoadingFlag: true
  },
  pageLifetimes: {
    show: function () {
      this.queryApplyOrder()
      this.queryMsg()
    },
  },
  lifetimes: {
    ready: function () {
      console.log('组件生命周期：lifetimes/ready')
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      this.setData({
        userInfo: Utils.getUserInfo(),
        userDeptNames: Utils.getUserDepartName()
      })
      //查询banner
      app.http.get(app.env.assetsUrl + '/minapp/banner/queryIndexBanner').then(data => {
        console.info('queryIndexBanner:' + JSON.stringify(data))
        this.setData({
          bannerList: data,
        })
      })
      this.queryApplyOrder()
      this.queryMsg()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    queryApplyOrder() {
      this.setData({
        isLoadingFlag: true
      })
      const queryCond = {
        size: 3,
        current: 1
      }
      //查询申领单
      app.http.post(app.env.assetsUrl + '/minapp/apply/query', queryCond, {}).then(data => {
        // console.info('applyList: %o', this.insertReceiveRate(data.records))
        this.setData({
          applyList: this.insertReceiveRate(data.records),
          isLoadingFlag: false
        })
      })
    },
    insertReceiveRate(array = []) {
      if (array && array.length > 0) {
        array.forEach(item => {
          item.receiveRate = parseInt((item.receivedDetailCount / (item.receivedDetailCount + item.unFinishDetailCount)) * 100)
        });
      }
      return array
    },
    queryMsg() {
      //查询通知
      const msgQueryCond = {
        size: 30,
        current: 1,
        readFlag: 0
      }
      app.http.post(app.env.assetsUrl + '/minapp/msg/queryMyMsg', msgQueryCond, {}).then(data => {
        if(data!=null){
          this.setData({
            msgList: data.records,
          })
        }
      })
    },
    init() {},
    GoAntiEpidemic() {
      if (Utils.getUserInfo().isPsy) {
        wx.navigateTo({
          url: '/pages/AntiEpidemicPages/DistributionPage/Distribution-TaskList/Distribution-TaskList',
        });
      } else {
        wx.navigateTo({
          url: '/pages/AntiEpidemicPages/AntiEpidemic/AntiEpidemic',
        });
      }

    },
    goRepair() {
      console.log(Utils.getUserInfo())

      wx.navigateTo({
        url: '/pages/repair/repairList/repairList',
      });
      
      // wx.navigateTo({
      //   url: '/pages/repair/testvioce/testvoice',
      // });
    },
    goMore() {
      wx.navigateTo({
        url: '/pages/notice/noticeList/noticeList',
      })
    },
    goBanner(e) {
      const data = e.currentTarget.dataset.data;
      data.jumpType = JSON.parse(data.jumpType)
      if (data.jumpType.code == 'link') {
        wx.navigateTo({
          url: '/pages/outSite/outSite?url=' + data.minappUrl,
        })
      } else if (data.jumpType.code == 'inform') {
        //跳转公告
        // wx.navigateTo({
        //   url: '/pages/notice/noticeDetail/noticeDetail?makeRead=1&id='+data.noticeId,
        // })
      }
    },
    goNoticeDetail(e) {
      const item = e.currentTarget.dataset.data;
      //一种跳转单据.一种显示详情
      // const item = this.data.latestMsg
      if (item.tittle == null || item.tittle == '') {
        return
      }
      //标记为已读-详情页面处理
      if (item.readFlag != '1') {
        const reqUrl = app.env.assetsUrl + `/minapp/msg/readSiteMsg?noticeId=${item.entityId}`
        app.http.get(reqUrl).then(data => {
          item.readFlag = '1'
          this.setData({
            noticeList: this.data.noticeList
          })
        })
      }
      const noticeExtend = JSON.parse(item.noticeExtend);
      let maUrlInfo = noticeExtend.maUrl;
      if (maUrlInfo == null || maUrlInfo == undefined) {
        maUrlInfo = {}
      }


      if (maUrlInfo.navigateType == 'outSite') {
        wx.navigateTo({
          url: '/pages/outSite/outSite?url=' + maUrlInfo.url,
        })
      } else if (maUrlInfo.navigateType == 'custom') {
        wx.navigateTo({
          url: maUrlInfo.url,
        })
      } else {
        //详情
        wx.navigateTo({
          url: '/pages/notice/noticeDetail/noticeDetail?notice=' + encodeURIComponent(JSON.stringify(item)),
        })
      }
    },
    goApplyDetail(e) {
      wx.navigateTo({
        url: '/pages/applyPages/applyInvoiceDetail/applyInvoiceDetail?entityId=' + e.currentTarget.dataset.entityid,
      })
    },
    goPersonCenter() {
      wx.navigateTo({
        url: '/pages/personCenter/personCenter',
      })
    },
    getUserInfo(e) {
      let that = this
      wx.getUserInfo({
        success: function (res) {
          console.info('获取用户信息:' + JSON.stringify(res))
          var userInfo = res.userInfo
        },
        fail: function (err) {
          console.info(err)
          wx.showModal({
            title: '提示',
            content: '授权失败',
            showCancel: false,
            confirmText: '确认',
            success: function (res) {
              if (res.confirm) {

              }
            }
          })
        }
      })
    },
    scan() {
      // 允许从相机和相册扫码
      const _this = this
      wx.scanCode({
        success(res) {
          ScanAnalysisUtils.analysisScanContent(res.result, "navigateTo");
        }
      })
    },
    gologin() {
      // encodeURIComponent(/pages/applyPages/deliverDetail/deliverDetail?ordersId=d29bfe2d3a8549d898c0a1fc60837a44)
      let url = '/pages/login/login?aimPageUrl=/pages/applyPages/deliverDetail/deliverDetail?ordersId=d29bfe2d3a8549d898c0a1fc60837a44';
      url = encodeURI(url)
      wx.navigateTo({
        url: url
      })
    }
  }
})