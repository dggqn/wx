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
        showTab: 'check',
        tabList: [
            {code:'check',name:'盘点',count:0},
            {code:'change',name:'变更',count:0},
            {code:'scrap',name:'报废',count:0},
        ],
    },
    lifetimes: {
        ready: function () {
            this.initTaskCount()
        },
    },
    pageLifetimes: {
        show: function () {
            this.initTaskCount()
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        changeTab: function (e) {
            this.setData({
                showTab: e.currentTarget.dataset.tab
            })
        },
        initTaskCount: function () {
            // 初始化数量
            app.http.get(app.env.assetsUrl + '/minapp/unfinishedTask/queryUnfinishedTaskTab').then(resp => {
                for (let i = 0; i < this.data.tabList.length; i++) {
                    if (resp[i]) {
                        this.data.tabList[i].count = resp[i].tabCount
                    }
                }
                this.setData({
                    tabList:this.data.tabList
                })
            })
        }
    }
})

