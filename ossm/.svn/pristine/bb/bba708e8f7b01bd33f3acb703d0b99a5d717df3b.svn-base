// miniprogram/pages/assetsTransfer/assetsDetail/taskDetail.js
import Utils from "../../../utils/utils";

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 'baseInfo',
        assetBarcode: '',
        isOwner: false,
        isReceiver: null,
        // 不需要接收弹窗()
        notNeedCheckDialog: false,
        selectedRows: [],
        asset: {},
        // 两个textarea显示隐藏，解决与vant弹出层提示文字问题
        canNotShow:false,
        txraShow:false,
        assetMarkValue:0,
    },

    changeTab(e) {
        this.setData({
            tab: e.currentTarget.dataset.tab
        })
    },

    loadAssetData() {
        if (!this.data.assetBarcode && !this.data.keywords) {
            wx.showToast({
                title: '请输入资产ID',
                icon: 'none',
                duration: 2000
            })
            return
        }
        const that = this
        app.http.get(app.env.assetsUrl + '/minapp/check/getCheckOrderAssetDetail/' + this.data.entityId + '/' + (this.data.assetBarcode ? this.data.assetBarcode : this.data.keywords)).then(data => {
        if(data.checkTaskStatusName === '待盘点') data.checkTaskStatusName = '未盘'
            if (data) {
                that.setData({
                    asset: data
                })
            } else {
                wx.showToast({
                    title: '无此资产',
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            assetBarcode: options.assetBarcode,
            entityId: options.entityId
        })
        this.loadAssetData()

    },
    submitScanAsset(req) {
        if (!this.data.assetBarcode) {
            wx.showToast({
                title: '请输入资产编码',
                icon: 'none',
                duration: 2000
            })
        }
        const that = this
        app.http.post(app.env.assetsUrl + '/minapp/check/scanAsset', req?req:{
            entityId: this.data.entityId,
            assetBarcode: this.data.assetBarcode,
            labelPhoto:this.data.asset.labelPhoto,
            devicePhoto:this.data.asset.devicePhoto,
            mark: this.data.asset.mark
        }).then(data => {
            wx.showToast({
                title: '成功',
                icon: 'none',
                duration: 2000
            })
            wx.navigateBack()
        });
    },
    flagCanNotLable(e){
        this.data.asset.mark=e.currentTarget.dataset.class
        this.setData({
            asset: this.data.asset,
            assetMarkValue: e.currentTarget.dataset.class.length
        })
    },
    canNotShow(){
        this.setData({canNotShow:true})
        setTimeout(()=>{
            this.setData({
                txraShow:true,
                canNotTxra:true
            })
        },2000)
    },
    canNotClose(){this.setData({
        canNotShow:false
    })},
    inputMark(e){
        this.data.asset.mark=e.detail.value
        this.setData({
            assetMarkValue:Math.min(this.data.asset.mark.length,50),
            // assetMarkValue:e.detail.cursor,
            asset:this.data.asset
        })},
    canNotLoading(){
        this.setData({
            txraShow:true,
            canNotTxra:true
        })
    },
    canNotPopupSubmit(){
        const that=this
        wx.showToast({
            title: '设置成功',
            icon:'success'
        })
        app.http.post(app.env.assetsUrl + '/minapp/check/scanAsset', {
            entityId: this.data.entityId,
            assetBarcode: this.data.assetBarcode,
            labelPhoto:this.data.asset.labelPhoto,
            devicePhoto:this.data.asset.devicePhoto,
            mark: this.data.asset.mark,
            status:'pending'
        }).then(data => {
            wx.showToast({
                title: '成功',
                icon: 'none',
                duration: 2000
            })
            const eventChannel = that.getOpenerEventChannel();
            const params = {entityId:that.data.entityId};
            eventChannel.emit('backFn',params)
            wx.navigateBack({
                complete: () => {
                    eventChannel.emit('backFn',params)
                }
            })
        });
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
