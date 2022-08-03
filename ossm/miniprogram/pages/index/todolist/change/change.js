// pages/index/unfinishedTask/unfinishedTask.js

const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        type: 1,
        showStatusFlag: false,
        dataList: [],
        status:'100',
        statusCount:{
            wait_receive: 0,
            wait_approval: 0,
        }
    },
    lifetimes: {
        ready: function () {
            this.getChangeCount(true)
        }
    },
    pageLifetimes: {
        show: function () {
            this.getChangeCount()
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        showStatus: function () {
            this.setData({
                showStatusFlag: !this.data.showStatusFlag
            })
        },
        getChangeCount: function (changeStatusFlag) {
            app.http.get(app.env.assetsUrl + '/minapp/ordersChange/getStatusCount').then(resp => {
                this.setData({
                    statusCount: resp
                })
                if (this.data.statusCount.wait_approval <= 0 && this.data.statusCount.wait_receive > 0 && changeStatusFlag) {
                    this.setData({
                        status: '101'
                    })
                }
                this.reload()
            })
        },
        changeStatus:function (e) {
            this.setData({
                status:e.currentTarget.dataset.status,
                showStatusFlag:false
            })
            this.reload()
        },
        reload: function () {
            const req = {
                type:this.data.type,
                status: this.data.status
            }
            app.http.post(app.env.assetsUrl + '/minapp/unfinishedTask/queryUnfinishedTask', req).then(resp => {
                this.setData({
                    dataList:resp.records
                })
            })
        },
        jumpDetails(e){
            const id = e.currentTarget.dataset.oid
            wx.navigateTo({
                url: '/pages/assetsRecordFolder/changeDetails/changeDetails?id=' + id + '&type=变更'
            })
        }
    }
})
