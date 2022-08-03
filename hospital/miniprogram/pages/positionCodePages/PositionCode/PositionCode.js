// pages/positionCodePages/PositionCode/PositionCode.js
import Utils from "../../../utils/utils";
import formChek from "../../../utils/FormCheck";
import drawQrcode from '../../../utils/weapp.qrcode.min.js'

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 5 * 60 * 1000,
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    identity: '3',
    realName: '',
    ID_number: '',
    haveName: false,
    showRegister: false, // 判断位置码模块中的人员是否注册过
    reqHidden: true, // 反馈给用户的结果
    phone: '1',
    LocationUserInfo: {},
    locationId: ''
  },
  /**
   * 绘制二维码
   * @param {*} resp 二维码包含的信息-字符串
   * @param {*} color 二维码前景颜色
   */
  initQrCode: function (resp, color = '#000000') {
    // var text = JSON.stringify({
    //   code: resp.code
    // })
    let text = resp;
    drawQrcode({
      width: 250,
      height: 250,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: text,
      foreground: color,
      // v1.0.0+版本支持在二维码上绘制图片
      // image: {
      // imageResource: '../../images/logo.png',
      //   dx: 70,
      //   dy: 70,
      //   dWidth: 60,
      //   dHeight: 60
      // }
    })
  },
  /**
   * 提交注册
   * @param {*} event 
   */
  submitRegister() {
    let that = this;
    let isOK = true;
    if (this.data.realName.length < 1) {
      this.setData({
        haveName: true
      });
      isOK = false;
    }
    if (!formChek.IDcardCheck(this.data.ID_number)) {
      this.setData({
        ID_numberError: '身份证号码不正确！'
      });
      isOK = false;
    }
    if (!formChek.phoneCheck(this.data.phone)) {
      this.setData({
        phoneError: '手机号格式错误！'
      });
      isOK = false;
    }
    if (!isOK) return; // 判断是否所有的校验都被通过
    let obj = {
      groupType: this.data.identity,
      name: this.data.realName,
      idcard: this.data.ID_number,
      tel: this.data.phone,
      orgName: this.data.orgName,
      aimDept: this.data.aimDept,
      emergencyContactPerson: this.data.ecPerson,
      emergencyContactNumber: this.data.ecPhone,
    }
    console.log(obj);
    app.http.post('/uaa/wx/minapp/locationPerson/insert', obj).then(data => {
      console.info(data);
      wx.showToast({
        title: '注册成功',
        icon: 'success'
      });
      this.getStoragePhone();
      that.setData({
        showRegister: false,
      });
    });

  },
  /**
   * 扫描位置码后，验证用户手机号，返回用户位置码相关信息
   * @param {*} event 
   */
  LocationUserLogin() {
    console.log('调用接口/locationTrack/scanCode')
    let that = this;
    let obj = {
      tel: this.data.phone,
      locationId: this.data.locationId
    }
    console.log(obj);
    app.http.post('/uaa/wx/minapp/locationTrack/scanCode', obj).then(data => {
      console.info(data);
      if (data.success === "false") {
        console.warn('弹出注册框');
        wx.showToast({
          title: data.msg,
          icon: 'none'
        });
        that.setData({
          showRegister: true,
        });
      } else {
        that.setData({
          LocationUserInfo: data,
          reqHidden: false
        });
        // that.initQrCode('LocationCode', data.riskColor); //生成二维码
      }
    });
  },

  /**
   * 前往查看14天内的历史位置
   * @param {*} event 
   */
  goHistory() {
    let that = this;
    wx.navigateTo({
      url: '../positionHistory/positionHistory?phone=' + that.data.phone,
    });
  },
  /**
   * 从缓存中读取用户手机号，并设置到data.phone中
   */
  getStoragePhone(callback) {
    let that = this;
    let Phone;
    wx.getStorage({
      key: 'phone_number',
      success(res) {
        Phone = res.data;
        that.setData({
          phone: res.data
        });
        that.LocationUserLogin();
      },
      fail(res) { // 没有用户输入的号码，说明之前已通过登录验证，这次是自动登录，则从用户信息中获取
        let userInfo_phone = wx.getStorageSync('hospital-userInfo');
        that.setData({
          phone: userInfo_phone.userMobile
        });
        Phone = userInfo_phone.userMobile;
        that.LocationUserLogin();
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      locationId: options.locationCode
    });
    this.getStoragePhone();
    // this.data.locationId = options.locationCode;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 低版本微信不支持简易双向绑定
  identityChange(event) {
    this.setData({
      identity: event.detail,
    });
  },
  realNameChange(event) {
    this.setData({
      realName: event.detail,
    });
    if (this.data.realName.length > 0) {
      this.setData({
        haveName: false
      });
    }
  },
  ID_numberChange(event) {
    this.setData({
      ID_number: event.detail,
    });
    if (formChek.IDcardCheck(this.data.ID_number)) {
      this.setData({
        ID_numberError: ''
      });
    }
  },
  phoneChange(event) {
    this.setData({
      phone: event.detail,
    });
    if (!formChek.phoneCheck(this.data.phone)) {
      this.setData({
        phoneError: ''
      });
    }
  },
  orgNameChange(event) {
    this.setData({
      orgName: event.detail,
    });
  },
  aimDeptChange(event) {
    this.setData({
      aimDept: event.detail,
    });
  },
  ecPersonChange(event) {
    this.setData({
      ecPerson: event.detail,
    });
  },
  ecPhoneChange(event) {
    this.setData({
      ecPhone: event.detail,
    });
  },
})