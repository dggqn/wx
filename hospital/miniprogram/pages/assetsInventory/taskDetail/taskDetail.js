// miniprogram/pages/assetsTransfer/assetsDetail/taskDetail.js
import Utils from "../../../utils/utils";

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        this.setData({entityId: e.entityId});
        app.http.post(app.env.assetsUrl + '/minapp/check/queryCheckOrderDetailForMinApp', {
            entityId: e.entityId
        }).then(resp => {
            this.setData({
                detail: resp
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
