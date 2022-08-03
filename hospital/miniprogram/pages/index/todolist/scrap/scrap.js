// pages/index/todolist/scrap/scrap.js
const app = getApp();
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
    status:'200',
    showStatusFlag:false,
    dataList:[]
  },
  lifetimes:{
    ready: function () {
      this.getStatusCount();
      this.queryTodoItem(1,this.data.status);
    }
  },
  pageLifetimes: {
    show () {
      this.getStatusCount();
      this.queryTodoItem(1,this.data.status);
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showStatus(){
      this.setData({
        showStatusFlag:!this.data.showStatusFlag
      })
    },
    changeStatus(e){
      this.setData({
        status:e.currentTarget.dataset.status,
        showStatusFlag:false
      })
      this.queryTodoItem(1,e.currentTarget.dataset.status);
    },
    getStatusCount(){
      app.http.get(app.env.assetsUrl + '/minapp/ordersScrap/getStatusCount').then(resp=>{
        this.setData({
          statusCount:resp.wait_approval
        })
      })
    },
    // queryRecordList(){
    //   const req = {
    //     current:1,
    //     pageSize:'5'
    //   }
    //   app.http.post(app.env.assetsUrl + '/minapp/ordersScrap/queryRecordList',req).then(resp=>{
    //     // ------
    //     if(!resp.records[0]){
    //       const dataList = [{
    //         displayImgUrl:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180127%2F5e544a9ea9f74cc2a560ff9c192cb008.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628215539&t=d377cd6c1b83a5a3b64ea4b776247e06',
    //         departNameC:'儿科',
    //         realnameC:'曹某',
    //         totalCount:'3',
    //         reason:'资产已经报废，不能在继续使用，申请报废',
    //         createTime:'2021-07-08 12:00:00',
    //         statusName:'审核中',
    //         entityId:'1413073332986843136'
    //       }]
    //       this.setData({dataList})
    //       return 
    //     }
    //     // --------
    //     this.setData({
    //       dataList:resp.records
    //     })
    //     console.log(this.data.dataList)
    //   })
    // },
    queryTodoItem(num,status){
      const res = {
        current:num,
        pageSize:5,
        status
      }
      app.http.post(app.env.assetsUrl + '/minapp/ordersScrap/queryTodoItem',res).then((res) => {
        this.setData({dataList:res})
      })
    },
    jumpDetails(e){
      const id = e.currentTarget.dataset.id
      wx.navigateTo({ 
          url:'/pages/assetsRecordFolder/scrapDetails/scrapDetails?id=' + id
      })
    },
  }
})
