//index.js
const app = getApp()
Page({
  data: {
    activeTab: ''
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的申请'
    })
    if (options.currentTab) {
      this.setData({
        activeTab: options.currentTab
      });
      return
    }
    this.setData({
      activeTab: 'apply'
    });
  },
  // 切换tab
  changeTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    let title = ''
    if (tab === 'apply') {
      title = '我的申请'
    }
    if (tab === 'supply') {
      title = '我的物资'
    }
    if (tab === 'unfinishedTask') {
      title = '我的待办'
    }
    if (tab === 'statistic') {
      title = '领用统计'
      wx.showToast({
        icon: 'none',
        title: '敬请期待,开发中...',
      })
      return
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      activeTab: tab
    })
  },
  // onPullDownRefresh:function(){
  //   // 开启下拉刷新
  //   setTimeout(()=>{
  //     // 关闭下拉刷新
  //     wx.stopPullDownRefresh()
  //   },1500)
  // },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    console.info('小心心 ...')
  },

  onPageScroll: function () {
    console.info('xxxxx')
  },
  onShow: function () {
    console.info('99999')
    if(wx.canIUse('hideHomeButton')){
      wx.hideHomeButton()
    }
  }

})
