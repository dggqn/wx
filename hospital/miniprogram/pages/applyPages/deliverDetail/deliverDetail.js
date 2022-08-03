import Utils from '../../../utils/utils'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canSignFlag: false,
        msg:'',
        msgDetail:'',
        showDetailTab: 'consumables',
        entityId: '',
        orderBaseInfo: {},
        consumablesTotalCount: 0,
        consumablesList: [],
        fixedTotalCount: 0,
        fixedList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '发货单详情',
        })
        this.data.entityId = options.entityId
        this.loadOrder();
    },
    loadOrder () {
        //加载详情
        app.http.get(app.env.assetsUrl + '/minapp/deliverOrder/load/'+this.data.entityId).then(data => {
            this.data.orderBaseInfo = {...data}
            delete this.data.orderBaseInfo.consumablesList;
            delete this.data.orderBaseInfo.fixedList;
            this.data.consumablesList = data.consumablesList;
            this.data.fixedList = data.fixedList;
            this.data.consumablesTotalCount = 0;
            this.data.fixedTotalCount = 0;
            if(this.data.consumablesList != null){
                for (let i = 0; i < this.data.consumablesList.length; i++) {
                    this.data.consumablesTotalCount += parseInt(this.data.consumablesList[i].totalCount+'')
                }
            }
            if(this.data.fixedList != null){
                for (let i = 0; i < this.data.fixedList.length; i++) {
                    this.data.fixedTotalCount += parseInt(this.data.fixedList[i].totalCount+'')
                }
            }
            // this.data.orderBaseInfo.destination = JSON.parse(this.data.orderBaseInfo.destination.code)
            const destination = this.data.orderBaseInfo.destination;
            const destinationId = this.data.orderBaseInfo.destinationId;
            if (destination == 'user' && destinationId == Utils.getUserInfo().entityId) {
                this.data.canSignFlag = true
            } else {
                if (destination != 'user') {
                    this.data.msg = '该发货单的去向不是用户!'
                    this.data.msgDetail = '发货单的去向:'+destination
                } else if (destinationId != Utils.getUserInfo().entityId) {
                    this.data.msg = '该发货单的收货人不是你!,当前手机号:'+Utils.getUserInfo().userMobile
                    this.data.msgDetail = `登陆人id:${Utils.getUserInfo().entityId},签收人id:${destinationId}`
                }
            }
            // this.data.canSignFlag = true
            this.setData({
                canSignFlag:this.data.canSignFlag,
                msg:this.data.msg,
                showDetailTab:this.data.showDetailTab,
                orderBaseInfo:this.data.orderBaseInfo,
                consumablesList:this.data.consumablesList,
                fixedList:this.data.fixedList,
                consumablesTotalCount: this.data.consumablesTotalCount,
                fixedTotalCount: this.data.fixedTotalCount
            })
        });
    },

    changeDetailTab (e) {
        this.setData({
            showDetailTab: e.currentTarget.dataset.tab
        })
    },

    /**
     * 展示不可签收的详情
     */
    showDetailMsg () {

    },

    /**
     * 耗材明细取消领取
     */
    cancelConsumDetail () {

    },

    /**
     * 去签收
     */
    goReceipt () {
        wx.navigateTo({
            url: '/pages/applyPages/scanSignComsum/scanSignComsum'
                +'?detailList='+encodeURIComponent(JSON.stringify(this.data.consumablesList))
                +'&orderId='+this.data.entityId
                +'&orderType=deliver'
        })
    },
    refresh () {
        this.loadOrder()
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
        //读取并情况缓存进行通讯
        let receive_detailId = wx.getStorageSync('receive_detailId');
        wx.removeStorageSync('receive_detailId');
        let receive_comsum = wx.getStorageSync('receive_comsum');
        wx.removeStorageSync('receive_comsum');
        if(receive_comsum || receive_detailId){
            //直接reload
            this.loadOrder()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {


    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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
