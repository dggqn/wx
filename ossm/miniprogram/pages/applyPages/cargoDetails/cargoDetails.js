// miniprogram/pages/applyPages/cargoDetails/cargoDetails.js
import Utils from '../../../utils/utils'

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        entityId: '',
        aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
        detail: {},
        step: 0,
        confirmReceiptShow:false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.entityId = options.entityId
        app.http.get(app.env.assetsUrl + '/minapp/refundOrder/queryOrdersRefundDetail/' + options.entityId, {}).then(data => {
            let step = 0
            switch (data.statusCode) {
                case 'checking':
                    step = 1
                    break
                case 'processing':
                    step = 2
                    break
                case 'user_cancel':
                    step = 2
                    break
                case 'wait_home_exchange':
                    step = 3
                    break
                case 'wait_home_return':
                    step = 3;
                    break;
                case 'supplier_refuse':
                    step = 2
                    break
                case 'exchange_finish':
                    step = 4
                    break
                case 'return_finish':
                    step = 4
                    break
                default:
                    break
            }
            this.setData({
                step: step,
                detail: data
            })
            wx.setNavigationBarTitle({
                title: data.serviceTypeName+'详情'
            })

        })
    },

    jumpStepsDetails() {
        wx.navigateTo({
            url: '../stepsDetails/stepsDetails?entityId=' + this.data.entityId,
        })
    },
    doCall: function () {
        const that=this
        if(this.data.detail.deliverymanPhone) {
            wx.showActionSheet({
                itemList: [this.data.detail.deliverymanPhone],
                success: function (res) {
                    wx.makePhoneCall({
                        phoneNumber: that.data.detail.deliverymanPhone, //此号码并非真实电话号码，仅用于测试
                        success: function () {
                        },
                        fail: function () {
                        }
                    })
                    if (!res.cancel) {
                    }
                }
            });
        }
    },
    cancelRefundOrder(){
        app.http.get(app.env.assetsUrl + '/minapp/refundOrder/cancelRefundOrder/' + this.data.entityId, {}).then(data => {
            wx.navigateBack()
        })
    },

// vant组件所需方法
    confirmReceiptClose(){
        this.setData({ confirmReceiptShow: false });
    },

    confirmReceipShowPopup(e){
        this.setData({ confirmReceiptShow: true });
    },
    cancelReceivingGoods(){
        this.setData({ confirmReceiptShow: false });
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
