// pages/index/supply/supply.js
import Utils from '../../../utils/utils'

var app = getApp()
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
    tab: 'assets',

    assetsSortOption: [
      { text: '默认排序', value: '' },
      { text: '按状态排序', value: 'assetsStatus' },
      { text: '按时间排序', value: 'signDate' }
    ],
    consumableSortOption: [
      { text: '默认排序', value: '' },
      { text: '按时间排序', value: 'lastedReceiveDate' },
      { text: '按数量排序', value: 'quantity' }
    ],
    sortOption: [],
    assetsList: [],//资产
    selectedNum:0,//选中的个数
    consumableList: [], //耗材
    isDeptManager: false,
    req: {
      current: 1,
      size: 9999,
      keyword: '', //关键字
      sortColumn: '',
      sortRule: 'desc'
    },
    chooseAll:false,
  },
  lifetimes: {
    ready: function () {
      // 在组件实例刚刚被创建时执行
      this.getMyAssets()
      this.setData({isDeptManager: Utils.judgeDepartmentManager()})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(e) {
      var req = this.data.req
      req.sortColumn = ''
      this.setData({
        tab: e.currentTarget.dataset.tab,
        req: req,
        assetsList: [],
        consumableList: []
      })
      if (e.currentTarget.dataset.tab === 'consume') {
        this.getMyConsumable()
      }
      if (e.currentTarget.dataset.tab === 'assets'){
        this.getMyAssets()
      }
      if (e.currentTarget.dataset.tab === 'sector-assets'){
        this.getMyDeptAssets()
      }
      if (e.currentTarget.dataset.tab === 'sector-consume'){
        this.getMyDeptConsumable()
      }
    },
    getMyDeptAssets() {
      wx.showLoading({
        title: '加载中...',
      })
      const url = app.env.assetsUrl + '/getMyDeptAssets'
      app.http.get(url, this.data.req).then(resp => {
        this.setData({
          assetsList: resp.records
        })
        wx.hideLoading()
      })
    },
    getMyDeptConsumable() {
      const url = app.env.assetsUrl + '/getMyDeptConsumable'
      wx.showLoading({
        title: '加载中...',
      })
      app.http.get(url, this.data.req).then(resp => {
        this.setData({
          consumableList: resp.records
        })
        wx.hideLoading()
      })
    },
    getMyAssets() {
      wx.showLoading({
        title: '加载中...',
      })
      var url = app.env.assetsUrl + '/myAssets'
      app.http.get(url, this.data.req).then(resp => {
        resp.records.forEach(item=>{
          if (item.lockFlag === null || item.lockFlag===undefined) {
            item.lockFlag = 0
          }
          item.selectable = true
          if (item.lockFlag > 0) {
            item.selectable = false
          }
          if (item.assetsStatus === "moving") {
            item.selectable = false
          }
        })
        this.setData({
          assetsList: resp.records
        })
        // 创建控制选中效果的数组
        this.data.assetsList.map(item=>{
          item.isSelected = false
        })
        wx.hideLoading()
      })
    },
    getMyConsumable() {
      var url = app.env.assetsUrl + '/myConsumable'
      wx.showLoading({
        title: '加载中...',
      })
      app.http.get(url, this.data.req).then(resp => {
        this.setData({
          consumableList: resp.records
        })
        wx.hideLoading()
      })
    },
    inputKeyword(e) {
      var req = this.data.req
      req.keyword = e.detail.value
      this.setData({
        req: req
      })
    },
    initList(){
      const list = this.data.assetsList.filter(item=>{
        item.statusName = item.dict.assetsStatus_dictText
        return item.isSelected 
      });
      if(!list[0]){
        wx.showToast({title: '请先选择使用中的资产',icon:'none'})
        return false
      }else{
        let flag = false
        list.filter(item => {
          if(item.statusName !== '使用中'){
            flag = true
          }
        });
        if(flag){
          wx.showToast({title: '仅支持使用中的资产进行操作',icon:'none'})
          return false
        }
        else return list
      }
    },
    changeTo(e) {
      if(this.initList()){
        wx.navigateTo({
          url: '/pages/assetsRecordFolder/assetsChange/assetsChange?type=' + e.currentTarget.dataset.type + '&list=' + JSON.stringify(this.initList()),
        })
      }
    },
    search() {
      if (this.data.tab == 'consume') {
        this.getMyConsumable()
      } else {
        this.getMyAssets()
      }
    },
    sort(e) {
      var req = this.data.req
      req.sortColumn = e.detail
      this.setData({
        req: req
      })
      this.search()
    },
    selected(e){
      // this.data.assetsList[e.currentTarget.dataset.index].isSelected = !this.data.assetsList[e.currentTarget.dataset.index].isSelected
      const data = `assetsList[${e.currentTarget.dataset.index}].isSelected`;
      this.setData({
        [data] : !this.data.assetsList[e.currentTarget.dataset.index].isSelected
      });
      let num = 0;
      this.data.assetsList.filter(item=>{
        if(item.isSelected){
          num++
        }
      });
      if(num === this.data.assetsList.filter(x => x.selectable).length) this.setData({chooseAll:true})
      else this.setData({chooseAll:false})
      this.setData({
        selectedNum: num
      })
    },
    jumpDetails(e){
      wx.navigateTo({
        url: '/pages/assetsRecordFolder/assetsDetails/assetsDetails?assetBarcode=' + e.currentTarget.dataset.snno
      })
    },
    chooseAll(){
      this.setData({
        chooseAll:!this.data.chooseAll
      })
      if(this.data.chooseAll){
        this.data.assetsList.map(item => {
          if (item.selectable) {
            item.isSelected = true
          }
        })
        this.data.selectedNum = this.data.assetsList.filter(x => x.selectable).length
      }else{
        this.data.assetsList.map(item => {
          item.isSelected = false
        })
        this.data.selectedNum = 0
      }
      this.setData({
        assetsList:this.data.assetsList,
        selectedNum:this.data.selectedNum
      })
    },
  }
})
