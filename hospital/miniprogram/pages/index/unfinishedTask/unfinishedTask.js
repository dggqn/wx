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
        showTab: '盘点',
        isWk: false,
        type: 0,
        showStatusFlag: false,
        dataList: [],
        tabList: [],
        status:''
    },
    lifetimes: {
        ready: function () {
            app.http.get(app.env.assetsUrl + '/minapp/unfinishedTask/queryUnfinishedTaskTab').then(resp => {
                this.setData({
                    tabList:resp
                })
                this.reload()
            })
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
        changeTab: function (e) {
            this.setData({
                showTab: e.currentTarget.dataset.tab,
                showStatusFlag: false,
                dataList: []
            })
            // todo: 各个tab默认的状态
            if (this.data.showTab === '变更') {
                this.setData({status: '100', type: 1});
            }
            if (this.data.showTab === '盘点') {
                this.setData({status: '', type: 0});
            }
            this.reload()
        },
        jumpDetails(e){
            const id = e.currentTarget.dataset.oid
            wx.navigateTo({
                url: '/pages/assetsRecordFolder/changeDetails/changeDetails?id=' + id
            })
        },
        goDetail:function (e) {
            let url=''
            url='/pages/assetsInventory/taskDetails/taskDetails'
            wx.navigateTo({
                url:url+'?entityId='+e.currentTarget.dataset.entityid
            })
        }
    }
})
