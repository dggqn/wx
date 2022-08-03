import ScanAnalysisUtils from '../../../utils/scanAnalysisUtils'

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        this.data.entityId = options.entityId
        // this.data.entityId = '1328576880936357888'
    },
    loadOrder () {
        //加载详情
        app.http.get(app.env.assetsUrl + '/minapp/receiveOrder/load/'+this.data.entityId).then(data => {
            this.data.orderBaseInfo = {...data}
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

    changeDetailTab (e) {
        this.setData({
            showDetailTab: e.currentTarget.dataset.tab
        })
    },

    showOrderQrcode () {
        wx.navigateTo({
            url: '/pages/applyPages/orderIdQrcode/orderIdQrcode?id='+this.data.orderBaseInfo.ordersNo
        })
    },

    /**
     * 扫码签收
     */
    scanReceipt () {
        // 允许从相机和相册扫码
        const _this = this
        wx.scanCode({
            success (res) {
                const assetBarcode = ScanAnalysisUtils.getAssetBarcode(res.result);
                //查询资产
                app.http.get(app.env.assetsUrl + '/minapp/asset/getByAssetBarcode/'+assetBarcode).then(data => {
                    if(data){
                        //简单判断,状态和仓库
                        data.positionType = JSON.parse(data.positionType);
                        data.status = JSON.parse(data.status);
                        data.canSign = true
                        if(data.status.code != 'in_stockroom'){
                            // wx.showToast({ title: '该资产不在仓库', icon: 'none' });
                            data.errorMsg = '该资产不在仓库';
                            data.canSign = false
                            //进入资产详情页面
                            wx.navigateTo({
                                url: '/pages/applyPages/scanSignAssets/scanSignAssets?assetJson='+encodeURIComponent(JSON.stringify(data))
                            })
                            return
                        }
                        if(data.positionType.code != 'stockroom'){
                            // wx.showToast({ title: '该资产不属于仓库', icon: 'none' });
                            data.errorMsg = '该资产不属于仓库';
                            data.canSign = false
                            //进入资产详情页面
                            wx.navigateTo({
                                url: '/pages/applyPages/scanSignAssets/scanSignAssets?assetJson='+encodeURIComponent(JSON.stringify(data))
                            })
                            return
                        }
                        if(_this.data.orderBaseInfo.stockroomId != data.stockroomId){
                            // wx.showToast({ title: `资产所属仓库(${this.data.orderBaseInfo.stockroomName})和领取仓库(${data.stockroomName})不符`, icon: 'none' });
                            data.errorMsg = `资产所属仓库(${data.stockroomName})和领取仓库(${_this.data.orderBaseInfo.stockroomName})不符`
                            data.canSign = false
                            //进入资产详情页面
                            wx.navigateTo({
                                url: '/pages/applyPages/scanSignAssets/scanSignAssets?assetJson='+encodeURIComponent(JSON.stringify(data))
                            })
                            return
                        }

                        //匹配签收资产/或者后端匹配
                        let aimFixed = null
                        for (var i = 0; i < _this.data.fixedList.length; i++) {
                            const item = _this.data.fixedList[i]
                            if(item.statusCode == 'wait_receive'
                                && item.modelId == data.modelId
                                ){
                                aimFixed = item;
                                break;
                            }
                        }
                        if(!aimFixed){
                            data.errorMsg = `领取单中不存在该资产(${data.name})`
                            data.canSign = false
                            //进入资产详情页面
                            wx.navigateTo({
                                url: '/pages/applyPages/scanSignAssets/scanSignAssets?assetJson='+encodeURIComponent(JSON.stringify(data))
                            })
                            return
                        }
                        wx.navigateTo({
                            url: '/pages/applyPages/scanSignAssets/scanSignAssets?assetJson='+encodeURIComponent(JSON.stringify(data))
                                +'&aimDetail='+encodeURIComponent(JSON.stringify(aimFixed))
                                +'&orderId='+_this.data.entityId
                        })
                    }else {
                        wx.showToast({ title: '系统未查询到该资产,资产码:'+assetBarcode, icon: 'none' });
                    }
                })
            }
        })
    },
    /**
     * 耗材明细取消领取
     */
    cancelConsumDetail () {
        const _this = this
        wx.showModal({
            title: '提示',
            content: '确认要取消申领吗',
            success (res) {
                if (res.confirm) {
                    const reqData = {
                        entityId:_this.data.entityId,
                        detailIdList:[]
                    }
                    for (let i = 0; i < _this.data.consumablesList.length; i++) {
                        const item = _this.data.consumablesList[i]
                        reqData.detailIdList.push(item.entityId)
                    }
                    //取消
                    app.http.post(app.env.assetsUrl + '/minapp/receiveOrder/cancelReceiveDetail',reqData,{}).then(data => {
                        _this.loadOrder()
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    /**
     * 资产明细取消领取
     */
    cancelFixedDetail (e) {
        const index = parseInt(e.currentTarget.dataset.index)
        const reqData = {
            entityId:this.data.entityId,
            detailIdList:[this.data.fixedList[index].entityId]
        }
        const _this = this
        wx.showModal({
            title: '提示',
            content: '确认要取消申领吗',
            success (res) {
                if (res.confirm) {
                    //取消
                    app.http.post(app.env.assetsUrl + '/minapp/receiveOrder/cancelReceiveDetail',reqData,{}).then(data => {
                        _this.loadOrder()
                    })
                } else if (res.cancel) {
                }
            }
        })

    },

    /**
     * 去签收
     */
    goReceipt () {
        wx.navigateTo({
            url: '/pages/applyPages/scanSignComsum/scanSignComsum'
                +'?detailList='+encodeURIComponent(JSON.stringify(this.data.consumablesList))
                +'&orderId='+this.data.entityId
                +'&orderType=receive'
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
        let receive_comsum = wx.getStorageSync('receive_comsum');
        wx.removeStorageSync('receive_comsum');
        this.loadOrder()
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
