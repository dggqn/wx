// miniprogram/pages/Inventory/scanAsset/scanAsset.js

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classFlag: '',
        assetBarcode: '',
        keywords: '',
        entityId: '',
        assetData: {},
        canNotShow:false,
        txraShow:false,
        assetDataMarkLength:0
    },
    inputMark(e){
        this.setData({
            // assetDataMarkLength:e.detail.cursor
            assetDataMarkLength:Math.min(e.detail.cursor,50)
        })
    },
    flagClass(e) {
        if(e.currentTarget.dataset.class === this.data.classFlag) return this.setData({classFlag:''})
        this.setData({
            classFlag: e.currentTarget.dataset.class
        })
    },
    flagCanNotLable(e){
        this.data.assetData.mark=e.currentTarget.dataset.class
        this.setData({
            assetData: this.data.assetData,
            assetDataMarkLength: this.data.assetData.mark.length
        })
    },
    canNotShow(){
        this.setData({canNotShow:true})
        setTimeout(()=>{
            this.setData({txraShow:true})
        },2000)
    },
    canNotClose(){this.setData({
        canNotShow:false
    })},
    inputRemark(e){
        this.data.assetData.mark=e.detail.value
        this.setData({
            assetData:this.data.assetData
    })},
    canNotLoading(){
        console.log('我执行了')
        this.setData({
            canNotTxra:true,
            txraShow:true
        })
    },
    canNotPopupSubmit(){
        wx.showToast({
            title: '设置成功',
            icon:'success'
        })
        const req={
            entityId: this.data.entityId,
            assetBarcode: this.data.assetBarcode,
            labelPhoto:this.data.assetData.labelPhoto,
            devicePhoto:this.data.assetData.devicePhoto,
            mark: this.data.assetData.mark,
            remark:this.data.assetData.remark,
            status:'pending'
        }
        this.submitScanAsset(req)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            assetBarcode: options.assetBarcode,
            entityId: options.entityId
        })
        if (options.assetBarcode) {
            this.loadAssetData()
        }
    },
    changeAssetBarcode(e) {
        this.setData({
            assetBarcode: '',
            assetData: '',
            keywords: e.detail.value
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
            if (data) {
                that.setData({
                    assetData: data,
                    assetBarcode: data.assetBarcode
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
    uploadImg(event) {
        const that = this
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                const imgPath = res.tempFilePaths[0];
                wx.uploadFile({
                    url: app.env.url + app.env.assetsUrl + '/oss/upload',
                    filePath: imgPath,
                    name: 'file',
                    header: {
                        'Authorization': 'bearer ' + wx.getStorageSync('hospital-token'),
                        'Content-Type': 'multipart/form-data'
                    },
                    formData: {
                        'file': imgPath,
                        'fileAccessPermission': 'PUBLIC_READ',
                        'uploadFileType': 'IMAGE',
                    },
                    success: (data) => {
                        const resultData = JSON.parse(data.data).data
                        that.data.assetData[event.currentTarget.dataset.photo] = resultData.url;
                        that.setData({
                            assetData: that.data.assetData
                        })
                    },
                    fail(res) {

                    }
                })
            },
        })
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
        app.http.post(app.env.assetsUrl + '/minapp/check/scanAsset', req.entityId?req:{
            entityId: this.data.entityId,
            assetBarcode: this.data.assetBarcode,
            labelPhoto:this.data.assetData.labelPhoto,
            devicePhoto:this.data.assetData.devicePhoto,
            mark: this.data.classFlag
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
