// miniprogram/pages/applyPages/stepsDetails/stepsDetails.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.entityId = options.entityId
        app.http.get(app.env.assetsUrl + '/minapp/refundOrder/queryOrdersRefundLog/' + options.entityId, {}).then(data => {
            data.forEach(function (d) {
                d.type=JSON.parse(d.type)
            })
            this.setData({
                list: data
            })
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
