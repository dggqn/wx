// pages/applyPages/scanSignAssets/scanSignAssets.js

import Utils from '../../utils/utils'

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
        isEmpty: false,
        asset:{},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.assetBarcode) {
            app.http.get(app.env.assetsUrl + '/minapp/asset/getByAssetBarcode/'+options.assetBarcode).then(data => {
                if (data) {
                    data.positionType = JSON.parse(data.positionType);
                    data.status = JSON.parse(data.status);
                    this.setData({
                        isEmpty: false,
                        asset:data
                    })
                }
            });
        }
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
