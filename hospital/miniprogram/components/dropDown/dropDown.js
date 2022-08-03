// components/dropDown/dropDown.js
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
    show: false,
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickItem (e) {
      this.triggerEvent('selectSort', {code: e.currentTarget.dataset.code,name:e.currentTarget.dataset.name})
      this.setData({
        show: false
      })
    },
    setDropData (data) {
      this.setData({
        show: true,
        list: data
      })
    }
  }
})
