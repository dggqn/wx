let app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },
  data: {
    subscribeMessage: {
      title: '消息订阅',
      content: '为了能更好的接受消息通知，请点击允许',
      logName: '智慧后保',
      show: true
    },
  },
  lifetimes: {
    ready: function () {
      var that = this
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          console.info('===='+JSON.stringify(res))
          that.setData({
            showDialog: true
          })
          if (res.subscriptionsSetting &&
            !res.subscriptionsSetting.mainSwitch) {
            that.setData({
              showDialog: true
            })
          }
        }
      })

    }
  },
  methods: {
    cancelCallback() {
      this.setData({
        showDialog: false
      })

    },
    subscribeMessage() {
      this.setData({
        showDialog: false
      })
      wx.requestSubscribeMessage({
        tmplIds: [
          '0tf_x8-88R9LiQtD-kGa35sNYr9aaQypoDhqhbJkL4I', //领用通知
          // 'VaYdBoTz1psXv95w71N4bFE8RoUX8CTpoWUEKE7v7bg', //取消申领
          // '1h3BWMig8ywk8mUSIQhb_UMRhecAJ1TG7rMiffriyKw', //领用单失效通知
          'yWV1AveWW_Fo3MJ79sRQDG-V-pn3IgciXn7enhYybrQ', //签收通知
          'XXSKLBeNGbq6ElhiBTkEdfpZ7bIiFAF21bAm3VItbIM' //供应商发货通知
        ],
        complete: function (resp) {
          console.info('订阅消息返回:' + JSON.stringify(resp))
          if (resp.errCode == '20004') {
            wx.showModal({
              title: '消息订阅失败',
              icon: 'none',
              content: '请在设置中打开消息订阅开关',
            })
          }
        }
      })
    }

  }
})
