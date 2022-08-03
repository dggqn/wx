
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
        isWk: false,
        type: 0,
        showStatusFlag: false,
        dataList: [],
        status:''
    },
    lifetimes: {
        ready: function () {
            this.reload()
        }
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
                resp.records.forEach((r) => {
                    r.status = JSON.parse(r.status);
                });
                this.setData({
                    dataList:resp.records
                })
            })
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
