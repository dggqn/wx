import Utils from '../../../utils/utils'

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
        showDetailTab: 'consumables',
        entityId: '',
        orderBaseInfo: {},
        consumablesTotalCount: 0,
        consumablesList: [],
        fixedTotalCount: 0,
        fixedList:[]
    },
    goRefundDetail (e) {
        wx.navigateTo({
            url: '/pages/applyPages/cargoDetails/cargoDetails?entityId='+e.currentTarget.dataset.entityid,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '签收单详情',
        })
        this.data.entityId = options.entityId
        this.loadOrder();
    },
    loadOrder () {
        //加载详情
        app.http.get(app.env.assetsUrl + '/minapp/receiptOrder/load/'+this.data.entityId).then(data => {
            this.data.orderBaseInfo = {...data}
            this.data.orderBaseInfo.receiptType = JSON.parse(this.data.orderBaseInfo.receiptType)
            delete this.data.orderBaseInfo.consumablesList;
            delete this.data.orderBaseInfo.fixedList;
            this.data.consumablesList = data.consumablesList;
            this.data.fixedList = data.fixedList;
            if(this.data.consumablesList == null || this.data.consumablesList.length<=0){
                this.data.showDetailTab = 'fixed'
            }
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
            this.setData({
                showDetailTab:this.data.showDetailTab,
                orderBaseInfo:this.data.orderBaseInfo,
                consumablesList:this.data.consumablesList,
                fixedList:this.data.fixedList,
                consumablesTotalCount: this.data.consumablesTotalCount,
                fixedTotalCount: this.data.fixedTotalCount
            })
        });
    },

    showCanNotToast (e) {
        wx.showToast({
            title: '仓库领取的物品售后请联系仓库管理员！',
            icon:"none"
        })
    },

    changeDetailTab (e) {
        this.setData({
            showDetailTab: e.currentTarget.dataset.tab
        })
    },
    jumpSeleteType(e){
        wx.navigateTo({
          url: '../selectType/selectType?type='+e.currentTarget.dataset.type,
        })
    },
    refresh () {
        this.loadOrder()
    },
    /**
     * 展示身份二维码
     */
    showIdentityCode () {
        wx.navigateTo({url:'/pages/qrCode/qrCode'})
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
        if(receive_detailId){
            //直接reload
            this.loadOrder()
        }
        let receive_comsum = wx.getStorageSync('receive_comsum');
        wx.removeStorageSync('receive_comsum');
        if(receive_comsum){
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
