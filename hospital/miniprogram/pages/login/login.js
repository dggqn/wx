// pages/login/login.js
import Utils from '../../utils/utils'
import ScanAnalysisUtils from '../../utils/scanAnalysisUtils'

var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    aimPageUrl: String
  },

  lifetimes: {
    created: function () {

    },
    attached: function () {
      // 在组件实例刚刚被创建时执行
      console.info('在组件实例刚刚被创建时执行')
      const token = app.getToken()
      if (token) {
        this.setData({
          isLogined: true
        })
        if (this.data.aimPageUrl) {
          wx.redirectTo({
            url: this.data.aimPageUrl,
          })
        } else {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      } else {
        wx.setNavigationBarTitle({
          title: '登录',
        });
        try {
          let value = wx.getStorageSync('phoneNumber')
          if (value) {
            this.setData({
              phoneNumber: value
            })
          }
        } catch (e) {
          // Do something when catch error
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    //是否已经登录
    isLogined: false,
    showUserInfoDialog: false,
    hospitalName: app.env.hospitalName,
    dialog_inputPhoneNumber: false, // 输入手机号弹窗是否显示
    phoneNumber: '' // 手机号
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ScanCode() { // 扫描位置码
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res);
          ScanAnalysisUtils.analysisScanContent(res.result, "navigateTo");
          // wx.navigateTo({
          //   url: '../positionCodePages/PositionCode/PositionCode',
          // });
        }
      })
    },
    login(phone) {
      app.login(phone, 'BIND', () => {
        wx.setStorageSync('phone_number', this.data.phoneNumber);
        console.log('登录成功后设置缓存' + this.data.phoneNumber);
        this.setData({
          showUserInfoDialog: true
        })
        if (this.data.aimPageUrl) {
          wx.redirectTo({
            url: this.data.aimPageUrl,
          })
        }
      })
    },
    getPhoneNumber(e) {
      let that = this
      console.log(e)
      wx.cloud.init()
      wx.cloud.callFunction({
        name:'getPhoneNumber',
        data:{
          weRunData:wx.cloud.CloudID(e.detail.cloudID),
        }
      }).then(res =>{
        console.log(res)
        that.setData({
          phone:res.result.moblie
        })
      }).catch(err=>{
        console.log(err);
      })
      // wx.login({
      //   success (res) {
      //     console.log(res);
      //     that.code = res.code
      //     if (that.code) {
      //       //发起网络请求
      //       wx.request({
      //         url: 'url',
      //       })
      //       console.log('验证登录请求');
      //       if (e.detail.errMsg == "getPhoneNumber:ok") {
      //         console.log("用户点击了接受", e)
      //         this.phone = e.detail.encryptedData;
      //         this.iv = e.detail.iv;
      //         this.getAccessToken(e); // 将code、phone、iv发给后台，让后台解密手机号，拿回openid和session
      //     } else {
      //         console.log("用户点击了拒绝")
      //     }
      //       wx.request({
      //         url: 'https://example.com/onLogin',
      //         data: {
      //           code: res.code
      //         }
      //       })
      //     } else {
      //       console.log('登录失败！' + res.errMsg)
      //     }
      //   }
      // })
    },
    // getPhoneNumber(e) {
    //   // 真机可能出现「hideToast:fail:toast can't be found」导致小程序卡死？
    //   // wx.hideToast()
    //   let that = this;
    //   console.log(e.detail)
    //   if (e.detail.errMsg == "getPhoneNumber:ok") {
    //     console.info('获取用户手机号：' + JSON.stringify(e.detail))
    //     wx.setStorage({
    //       data: e.detail,
    //       key: 'mobileNo',
    //     })
    //     that.login(e.detail)

    //   } else {
    //     wx.showModal({
    //       title: '警告',
    //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
    //       showCancel: false,
    //       confirmText: '返回授权',
    //       success: function (res) {
    //         if (res.confirm) {

    //         }
    //       }
    //     })
    //   }
    // },
    // 输入手机号弹框
    showDialog(e) {
      console.log(app.env);
      let _this = this;
      wx.getStorage({
        key: 'phone_number',
        success(res) { // 从缓存从读到手机号则直接去登录
          console.log(res.data)
          _this.setData({
            phoneNumber: res.data,
            ToDo: e.currentTarget.dataset.todo
          });
          _this.inputPhoneNumber();
        },
        fail() { // 没读到手机号则让用户输入
          _this.setData({
            dialog_inputPhoneNumber: true,
            ToDo: e.currentTarget.dataset.todo
          });
        }
      })

    },

    onClose() {
      console.log('close');
      this.setData({
        dialog_inputPhoneNumber: false
      });
    },
    inputPhoneNumber(e) {
      // wx.hideToast()
      let that = this;
      const isNumber = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (isNumber.test(this.data.phoneNumber)) {
        if (that.data.ToDo == 'location') {
          wx.setStorageSync('phone_number', this.data.phoneNumber);
          console.log('使用位置码功能-设置手机号缓存' + this.data.phoneNumber);
          that.ScanCode(); // 执行扫描位置码操作
        } else if (that.data.ToDo == 'login') {
          that.login(this.data.phoneNumber); // 执行登录操作
        }
      } else {
        wx.showModal({
          title: '警告',
          content: '您没有提交正确的手机号，将无法使用小程序',
          showCancel: false,
          confirmText: '返回',
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    },
  }
})