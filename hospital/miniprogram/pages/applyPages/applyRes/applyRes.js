// miniprogram/pages/applyPages/applyRes/applyRes.js
import Utils from '../../../utils/utils'

var app = getApp()

const categoryList = []
for (var i = 0; i < 100; i++) {
  categoryList.push({
    entityId:''+i,
    code:''+i,
    name:'类别'+i,
    hidden:false
  })
}

const templateList = []
for (var i = 0; i < 100; i++) {
  templateList.push({
    entityId:''+i,
    detailCount: i,
    templateName:'模板'+i,
    choose: false
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    categoryPopShow: false,
    chooseSpecShow: false,
    applyTemplateShow: false,
    applyListShow: false,   //购物车展示属性
    categoryName: '全部分类',
    categorySearchKey: '', // 搜索分类的值
    activeQuery: '', // 点击选择分类的值
    categoryList: categoryList,
    categoryNodeList: [],
    headCategoryNodeList: [
      {
        entityId: '-1',
        code: '',
        name: '全部',
        productionCount: 10
      },
      {
        entityId: '1',
        code: '',
        name: '设备',
        productionCount: 10
      },
      {
        entityId: '2',
        code: '',
        name: '耗材',
        productionCount: 10
      }
    ],
    templateList: templateList,
    selectedTemplate: {},
    modelList: [
      {
        name: '',
        specificationName: '',
        modelNo: '',
        entityId: '1',
        displayImgUrl: ''
      }
    ],
    modelTotal: 0,
    applyList: [],
    aimModel: {},
    queryCond: {
      size: 20,
      current: 1,
      categoryId: '',
      keyword: ''
    }
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
      if(e.currentTarget.dataset.maxvalue){
        if(parseInt(e.currentTarget.dataset.maxvalue)<parseInt(value)){
          value = parseInt(e.currentTarget.dataset.maxvalue)
          sync = true
        }
      }
      aimObj[pathArray[length-1]] = value

      if(e.currentTarget.dataset.arrayremovevalue){
        if(parseInt(e.currentTarget.dataset.arrayremovevalue)==parseInt(value)){
          let aimRemoveObj = this.data
          for (var i = 0; i < length-3; i++) {
            aimRemoveObj = aimRemoveObj[pathArray[i]]
          }
          aimRemoveObj[pathArray[length-3]].splice(pathArray[length-2],1)
          sync = true
        }
      }

      if(sync){
        const syncData = {}
        syncData[pathArray[0]] = this.data[pathArray[0]]
        this.setData(syncData)
      }
    }
  },
  commomCountChange (e) {
    const path = e.currentTarget.dataset.path
    const count = parseInt(e.currentTarget.dataset.count)
    if(path && count){
      const pathArray = e.currentTarget.dataset.path.split(".")
      const length = pathArray.length
      let aimObj = this.data
      for (var i = 0; i < length-1; i++) {
        aimObj = aimObj[pathArray[i]]
      }
      let value = parseInt(aimObj[pathArray[length-1]]) + count
      if(e.currentTarget.dataset.minvalue){
        if(parseInt(e.currentTarget.dataset.minvalue)>parseInt(value)){
          value = parseInt(e.currentTarget.dataset.minvalue)
        }
      }
      if(e.currentTarget.dataset.maxvalue){
        if(parseInt(e.currentTarget.dataset.maxvalue)<parseInt(value)){
          value = parseInt(e.currentTarget.dataset.maxvalue)
        }
      }
      aimObj[pathArray[length-1]] = value
      if(e.currentTarget.dataset.arrayremovevalue){
        if(parseInt(e.currentTarget.dataset.arrayremovevalue)==parseInt(value)){
          let aimRemoveObj = this.data
          for (var i = 0; i < length-3; i++) {
            aimRemoveObj = aimRemoveObj[pathArray[i]]
          }
          aimRemoveObj[pathArray[length-3]].splice(pathArray[length-2],1)
        }
      }
      const syncData = {}
      syncData[pathArray[0]] = this.data[pathArray[0]]
      this.setData(syncData)
    }
  },
  keywordChange (e) {
    this.data.queryCond.keyword = e.detail.value
  },
  goApply () {
    //过滤掉数量为0的
    const applyList = []
    for (var i = 0; i < this.data.applyList.length; i++) {
      const item = this.data.applyList[i]
      if(item.totalCount > 0){
        applyList.push(item)
      }
    }
    if(applyList.length == 0){
      wx.showToast({
        title: '请添加需要的商品',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return
    }
    const applyListStr = encodeURIComponent(JSON.stringify(applyList));
    wx.navigateTo({
      url: '/pages/applyPages/updateApply/updateApply?applyList='+applyListStr
    })
  },
  //弹出购物车
  showApplyListPop () {
    if (this.data.applyList.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '您还没选择任何物品',
      })
      return
    }
    this.setData({
      applyListShow: true
    })
  },
  // 弹出选择规格
  chooseSpecPopup (e) {
    if(e.currentTarget.dataset.model) {
      const aimModel = {
        ...e.currentTarget.dataset.model,
        totalCount: 1,
        remark: ''
      }
      for (var i = 0; i < this.data.applyList.length; i++) {
        const item = this.data.applyList[i]
        if(item.entityId == aimModel.entityId) {
          aimModel.totalCount = item.totalCount
          aimModel.remark = item.remark
          break;
        }
      }
      this.setData({
        chooseSpecShow: true,
        aimModel: aimModel
      })
    }
  },
  aimModelCountChange (e) {
    this.data.aimModel.totalCount = parseInt(this.data.aimModel.totalCount)+parseInt(e.currentTarget.dataset.count)
    if(this.data.aimModel.totalCount<1){
      this.data.aimModel.totalCount = 1
    }
    this.setData({
      aimModel: this.data.aimModel
    })
  },
  // 确定选择规格
  confirmChoose () {
    this.setData({
      chooseSpecShow: false
    })
    const aimModel = this.data.aimModel
    let hasOld = false;
    //aimModel 清空并且放入 applyList
    for (var i = 0; i < this.data.applyList.length; i++) {
      const item = this.data.applyList[i]
      if(item.entityId == aimModel.entityId) {
        item.totalCount = aimModel.totalCount
        item.remark = aimModel.remark
        hasOld = true
        break;
      }
    }
    if(!hasOld) {
      this.data.applyList.push({
        ...aimModel
      })
    }
    this.setData({
      applyList:this.data.applyList
    })
  },
  // 申领模板弹窗
  applyTemplate () {
    this.data.selectedTemplate = {}
    this.setData({
      applyTemplateShow: true
    })
  },
  // 关闭申领模板弹窗
  closeApplyTemplate () {
    this.setData({
      applyTemplateShow: false
    })
  },
  deleteTemplate (e) {
    const entityId = this.data.templateList[e.currentTarget.dataset.index].entityId
    this.data.templateList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      templateList:this.data.templateList
    })
    //api调用
    app.http.get(app.env.assetsUrl + '/minapp/applyTemplate/delete/'+entityId).then(data => {

    })
  },
  changeTemplate (e) {
    for (var i = 0; i < this.data.templateList.length; i++) {
      if(e.currentTarget.dataset.index == i){
        this.data.templateList[i].choose = true
        this.data.selectedTemplate = this.data.templateList[i]
      }else {
        this.data.templateList[i].choose = false
      }
    }
    this.setData({
      templateList:this.data.templateList
    })
  },
  selecedTemplate () {
    const _this = this
    this.closeApplyTemplate()
    if(this.data.selectedTemplate.entityId){
      app.http.get(app.env.assetsUrl + '/minapp/applyTemplate/queryDetailList/'+this.data.selectedTemplate.entityId).then(data => {
        console.info('queryDetailList:' + JSON.stringify(data))
        _this.setData({
          applyList: data
        })
      })
    }
    // this.data.applyList = [];
  },
  // 显示物品分类弹窗
  showCategeryPop () {
    this.setData({
      categoryPopShow: true
    })
  },
  // 显示物品分类弹窗
  closeCategeryPop () {
    this.setData({
      categoryPopShow: false
    })
  },
  closeOrOpenCategory (e) {
    const index = e.currentTarget.dataset.index
    const category = this.data.categoryNodeList[index]
    category.close = !category.close
    this.setData({
      categoryNodeList: this.data.categoryNodeList
    })
  },
  filterCategery (e) {
    let filterValue = this.data.categorySearchKey.trim()
    const categoryNodeList = this.data.categoryNodeList
    for (var i = 0; i < categoryNodeList.length; i++) {
      const c = categoryNodeList[i];
      const subList = c.subCategoryList;
      if(c.name.indexOf(filterValue)>=0){
        c.hidden = false;
      }else {
        c.hidden = true;
      }
      for (var j = 0; j < subList.length; j++) {
        const sc = subList[j];
        sc.hidden = false;
      }
      if (c.hidden) {
        for (var j = 0; j < subList.length; j++) {
          const sc = subList[j];
          if(sc.name.indexOf(filterValue)>=0 && sc.productionCount>=1){
            sc.hidden = false;
            c.hidden = false;
          }else {
            sc.hidden = true;
          }
        }
      }
    }
    this.setData({
      categoryNodeList: this.data.categoryNodeList
    })
  },
  changeCategoryId (e) {
    this.setData({
      activeQuery: e.currentTarget.dataset.category.entityId
    })
    this.closeCategeryPop()
    const category = e.currentTarget.dataset.category
    if(category && category.entityId !== 'all'){
      this.data.queryCond.categoryId = category.entityId;
      this.setData({
        categoryName: category.name
      })
    }else {
      this.data.queryCond.categoryId = '';
      this.setData({
        categoryName: '全部分类'
      })
    }
    //重置查询页数
    this.data.queryCond.current = 1
    this.selecteModelList();
  },
  initCurrentAndSelectModelList () {
    //重置查询页数
    this.data.queryCond.current = 1
    this.selecteModelList();
  },
  selecteModelList () {
    const queryCond = {
      ...this.data.queryCond
    }
    if(this.data.queryCond.current != 1 && this.data.modelTotal<=this.data.modelList.length){
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
      return
    }
    const _this = this
    app.http.post(app.env.assetsUrl + '/minapp/apply/queryModelList', queryCond, {}).then(data => {
      console.info('modelList:' + JSON.stringify(data))
      _this.data.modelTotal = data.total
      if(_this.data.queryCond.current == 1){
        _this.setData({
          modelList: data.records
        })
      }else {
        if (data.records.length<=0) {
          wx.showToast({
            title: '没有更多数据了！',
            icon: 'none'
          })
        }else {
          _this.setData({
            modelList: _this.data.modelList.concat(data.records)
          })
        }
      }
    })
  },
  // 上拉加载
  bindscrolltolower () {
    if(this.data.modelTotal<=this.data.modelList.length){
      return
    }
    this.data.queryCond.current += 1;
    this.selecteModelList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selecteModelList();
    //类别初始化
    const _this = this
    const queryCond = {}
    // app.http.post(app.env.assetsUrl + '/minapp/category/queryList', queryCond, {}).then(data => {
    //   data.unshift({entityId: 'all', name: '全部分类', productionCount: 10})
    //   _this.setData({
    //     categoryList: data
    //   })
    // })
    app.http.post(app.env.assetsUrl + '/minapp/category/querySecondLevelCategory', queryCond, {}).then(data => {
      console.info('categoryNodeList:' + JSON.stringify(data))
      // data.unshift({entityId: 'all', name: '全部分类', productionCount: 10})
      for (var i = 0; i < data.length; i++) {
        const c = data[i];
        c.close = true;
        c.hidden = false;
        const subList = c.subCategoryList;
        for (var j = 0; j < subList.length; j++) {
          const sc = subList[j];
          sc.hidden = false;
        }
      }
      _this.setData({
        categoryNodeList: data
      })
    })

    //模板初始化
    app.http.post(app.env.assetsUrl + '/minapp/applyTemplate/queryList', queryCond, {}).then(data => {
      _this.setData({
        templateList: data
      })
    })
  },
  closeSpecModal () {
    this.setData({
      chooseSpecShow: false
    })
  },
  // 关闭分类查询弹窗
  closeCategoryPopup () {
    this.setData({
      categoryPopShow: false
    })
  },
  // 分类搜索文字
  changeSearchKey (e) {
    this.setData({
      categorySearchKey: e.detail.value
    })
  },
  // 关闭选择物品弹窗
  closeChooseSpec () {
    this.setData({
      chooseSpecShow: false
    })
  },
  // 关闭购物车弹窗
  closeApplyList () {
    this.setData({
      applyListShow: false
    })
  },
  // 清空购物车
  clearCar () {
    this.setData({
      applyList: [],
      applyListShow: false
    })
  },
  // 减购物车
  cutCarItemTotal (e) {
    const num = --e.currentTarget.dataset.carItem.totalCount
    const operate = this.data.applyList.find((item) => item.entityId === e.currentTarget.dataset.carItem.entityId)
    operate.totalCount = num
    if (operate.totalCount <= 0) {
      const operateIndex = this.data.applyList.findIndex((item) => item.entityId === e.currentTarget.dataset.carItem.entityId)
      this.data.applyList.splice(operateIndex, 1)
    }
    this.setData({
      applyList: this.data.applyList
    })
    if (this.data.applyList.length <= 0) {
      this.setData({
        applyListShow: false
      })
    }
  },
  // 加购物车
  addCarItemTotal (e) {
    const num = ++e.currentTarget.dataset.carItem.totalCount
    const operate = this.data.applyList.find((item) => item.entityId === e.currentTarget.dataset.carItem.entityId)
    operate.totalCount = num
    this.setData({
      applyList: this.data.applyList
    })
  },
  // 文本框改变数据
  carItemChange (e) {
    const operate = this.data.applyList.find((item) => item.entityId === e.currentTarget.dataset.carItem.entityId)
    operate.totalCount = parseInt(e.detail.value)
    this.setData({
      applyList: this.data.applyList
    })
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
    //判断是否需要刷新购物车
    // let clear_production = wx.getStorageSync('clear_production');
    // wx.removeStorageSync('clear_production');
    // if(clear_production){
    //   this.clearCar()
    // }

    wx.removeStorageSync('clear_car');
    // 缓存获取
    const carData = wx.getStorageSync('carData')
    if (carData) {
      this.setData({
        applyList: carData
      })
    } else {
      this.setData({
        applyList: []
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //缓存设置
    const carData = this.data.applyList
    wx.setStorageSync('carData', carData)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let clear_car = wx.getStorageSync('clear_car');
    if (clear_car) {
      wx.removeStorageSync('clear_car');
    } else {
      //缓存设置
      const carData = this.data.applyList
      wx.setStorageSync('carData', carData)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
