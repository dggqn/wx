// components/addressCell/addressCell.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 删除
     * @param event
     */
    deleteAddress(event) {
      const addrId = event.currentTarget.dataset.addrid
      // 获取地址详情
      app.http.get(app.env.assetsUrl + '/minapp/addr/delete',{id: addrId}).then(resp => {
        if (resp) {
          wx.showToast({
            title: '操作成功',
          })
          this.refreshEvent()
        }
      })
    },
    /**
     * 编辑地址
     */
    modifyAddress(event){
      const addrId = event.currentTarget.dataset.addrid
      wx.navigateTo({
        url: '/pages/address/addOrModifyAddress/addOrModifyAddress?operate=modify&entityId=' + addrId,
      })
    },
    setList (list) {
      this.setData({
        list: list
      })
    },
    /**
     * 向父组件发射刷新事件
     */
    refreshEvent() {
      this.triggerEvent('refresh', {},{})
    },
    /**
     * 向父组件发射click事件
     */
    clickEvent(e) {
      const detail = e.currentTarget.dataset
      this.triggerEvent('click', detail,{})
    }
  }
})
