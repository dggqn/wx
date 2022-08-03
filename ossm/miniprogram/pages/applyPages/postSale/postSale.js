// miniprogram/pages/applyPages/postSale/postSale.js
import Utils from '../../../utils/utils'

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
        fileList: [],
        postSaleshow: false,
        serviceTypeShow: false,
        postSaleColumns: [],
        serviceTypeColumns: [{name: '退货', code: 'returngoods'}, {name: '换货', code: 'exchange'}],
        selectedServiceType: {name: '退货', code: 'returngoods'},
        detail: {},
        selectAddressModal: false,
        addressList: [],
        addressInfo: {}
    },
    afterRead(event) {
        const that = this
        const {file} = event.detail;
        wx.uploadFile({
            url: app.env.url + app.env.assetsUrl + '/oss/upload',
            filePath: file.path,
            name: 'file',
            header: {
                'Authorization': 'bearer ' + wx.getStorageSync('hospital-token'),
                'Content-Type': 'multipart/form-data'
            },
            formData: {
                'file': file.path,
                'fileAccessPermission': 'PUBLIC_READ',
                'uploadFileType': 'IMAGE',
            },
            success: (data) => {
                const resultData = JSON.parse(data.data).data
                const f = {
                    url: resultData.url,
                    name: resultData.fileName
                }
                that.data.fileList.push(f)
                that.setData({
                    fileList: this.data.fileList
                })
            },
            fail(res) {
            }
        })
    },
    deleteImg(e) {
        this.data.fileList.splice(e.detail.index, 1);
        this.setData({
            fileList: this.data.fileList
        })
    },
    explainationChange(e) {
        if(e.detail.value.length>100){
            wx.showToast({
                title: '不能超过100字',
                icon:"none"
            })
            return
        }
        this.data.detail.explaination = e.detail.value
        this.setData({
            detail: this.data.detail
        })
    },
    postSaleClose() {
        this.setData({postSaleshow: false})
    },
    postSaleConfirm(e) {
        this.data.detail.reason = e.detail.value
        this.setData({
            detail: this.data.detail,
            postSaleshow: false
        })
    },
    postSaleCancel(e) {
        this.setData({postSaleshow: false})
    },
    postSaleChange(event) {
        this.data.detail.reason = event.detail.value
        this.setData({detail: this.data.detail})
    },
    postSaleShowPopup() {
        this.setData({postSaleshow: true})
    },
    serviceTypeClose() {
        this.setData({serviceTypeShow: false})
    },
    serviceTypeChange(event) {
        this.setData({
            selectedServiceType: event.detail.value
        })
    },
    serviceTypeCancel(){
        this.setData({
            serviceTypeShow:false
        })
    },
    serviceTypeConfirm(e){
        this.setData({
            selectedServiceType: e.detail.value,
            serviceTypeShow:false
        })
    },
    serviceTypeShowPopup() {
        this.setData({serviceTypeShow: true})
    },
    pushApply() {
        let imgs = []
        this.data.fileList.forEach(function (value) {
            imgs.push(value.url)
        })
        if (!this.data.detail.reason) {
            wx.showToast({
                title: '请选择原因',
            })
            return
        }
        const req = {
            receiptDetailId: this.data.receiptDetailId,
            reason: this.data.detail.reason,
            serviceType: this.data.selectedServiceType.code,
            explaination: this.data.detail.explaination,
            applyHandleCount: this.data.detail.applyHandleCount,
            imgs: imgs,
            addressInfo: this.data.addressInfo
        }
        app.http.post(app.env.assetsUrl + '/minapp/refundOrder/addRefundOrder', req, {}).then(data => {
            if (data) {
                wx.showToast({
                    title: '提交成功',
                })
                wx.navigateTo({
                    url: '../hasApplyList/hasApplyList?type=afterSales'
                })
            }
        })
    },
    stepperChange(event) {
        this.data.detail.applyHandleCount = event.detail
        this.setData({
            applyHandleCount: this.data.detail.applyHandleCount
        })
    },
    // 选择地址
    chooseAddress() {
        this.setData({
            selectAddressModal: true
        })
    },
    // 关闭选择地址
    closeAddressModal() {
        this.setData({
            selectAddressModal: false
        })
    },
    // 获取地址列表
    getAddressList() {
        const addressInfo = this.data.addressInfo
        app.http.post(app.env.assetsUrl + '/minapp/addr/myAddress', {ownerType: 'user'}, {}).then(data => {
            if (data && data.length > 0) {
                for (let a of data) {
                    // 如果有默认的 选中
                    if (a.defaultFlag === '1') {
                        this.setData({
                            addressInfo: a
                        });
                    }
                    // 如果已有选择的 默认选中该选项 优先级较高
                    if (addressInfo && addressInfo.entityId === a.entityId) {
                        this.setData({
                            addressInfo: a
                        });
                    }
                }
            }
            // 设置list
            this.setData({
                addressList: data
            })
        })
    },
    // 新增地址
    addAddress() {
        wx.navigateTo({
            url: '/pages/address/addOrModifyAddress/addOrModifyAddress?operate=add',
        })
    },
    changeAddressInfo(e) {
        const address = e.detail.item
        const selectedId = address.entityId
        const items = this.data.addressList
        for (let i = 0, len = items.length; i < len; ++i) {
            const item = items[i]
            item.checked = false
            if (item.entityId === selectedId) {
                item.checked = true
                this.setData({
                    addressInfo: item
                })
            }
        }
        this.setData({
            addressList: items
        })
        // 选中后关闭弹窗
        this.closeAddressModal()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        this.setData({
            receiptDetailId: options.entityId
        })
        app.http.get(app.env.assetsUrl + '/minapp/sysDict/queryByDictCode?dictCode='+ 'return_reason', {}).then(data => {
            const postSaleColumns=[]
            for (const dataKey in data) {
                postSaleColumns.push(data[dataKey].itemText)
            }
            this.setData({
                postSaleColumns:postSaleColumns
            })
        })
        app.http.get(app.env.assetsUrl + '/minapp/refundOrder/loadBaseData/' + this.data.receiptDetailId).then(data => {
            if (!data.applyHandleCount) {
                data.applyHandleCount = data.purchaseCount
            }
            if (data.serviceType === 'exchange') {
                that.setData({
                    selectedServiceType: {name: '换货', code: 'exchange'}
                })
            }
            const fileList = []
            for (const index in data.imgs) {
                fileList.push({
                    url: data.imgs[index],
                    name: index
                })
            }
            this.setData({
                detail: data,
                receiptDetailId:data.receiptDetailId,
                addressInfo: data.addressInfo,
                fileList: fileList
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
        this.getAddressList()
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
