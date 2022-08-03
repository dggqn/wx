import Config from "../config/index"
import RequestLoadingUtils from './RequestLoadingUtils'
import SignUtils from '../security/SignUtils'
import EncryptUtils from '../security/EncryptUtils'

/**
 * 封装的请求接口
 * @author jackphang
 */
export default class Request {

  request(method, url, data, config) {
    // 如果是get 将url中的参数放入data
    if (method.toUpperCase() === 'GET' && url.indexOf('?')>=0) {
      data = data?data:{}
      const paramStr = url.split('?')[1]
      const paramArray = paramStr.split("&")
      for (let i = 0; i < paramArray.length; i++) {
        const param = paramArray[i]
        const key = param.split('=')[0]
        const value = param.split('=')[1]
        data[key] = value;
      }
    }

    let header = {
      "Content-Type": "application/json",
    }
    //使用自定义的请求头
    if (config && config.contentType) {
      header = {
        "Content-Type": config.contentType
      }
    }
    //token
    let token = wx.getStorageSync('hospital-token')
    if (token && (!config || !config.clientAuth)) {
      header.Authorization = 'bearer ' + token
    }

    if (!config) {
      config = {}
    }
    config.headers = header
    config.url = Config.env.url + url
    config.data = data

    var originConfig = Object.assign({}, config)
    SignUtils.sign(config)
    EncryptUtils.encrypt(config)
    if (Config.env.ENV == 'uat') {
      console.info("请求地址：%s，请求参数：%s", originConfig.url, JSON.stringify(originConfig.data))
    }

    let showLoading = RequestLoadingUtils.isShowLoading(url)
    if (showLoading) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        data: config.data,
        method: method,
        header: config.headers,
        success: function (res) {
          if (showLoading) {
            wx.hideLoading()
          }
          let data = res.data
          if (res.statusCode == '900') {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 3000
            })
            return
          }
          if (url.indexOf('oauth/token') >= 0) {
            resolve(data)
          } else if (data.error) {
            wx.showModal({
              content: data.error_description,
              showCancel: false,
              confirmText: '确认',
              success: function (res) {
                if (res.confirm) {

                }
              }
            })
          } else if (data.success == true) {
            resolve(data.data)
          } else if (data.status == 'UNAUTHORIZED') {
            // 未登录要进行登录操作,不提示信息
            // wx.showToast({
            //   title: '无权限操作',
            //   icon: "none",
            //   duration: 2000
            // })
            return
          } else if (data.status == "INVALID_GRANT") {
            //用户未注册账号不存在
            resolve(data)
          } else if (data.status == "INVALID_TOKEN") {
            //token失效的时候
            //清空token
            wx.removeStorageSync('token')
            //重新调用登录方法
            wx.showModal({
              showCancel: false,
              content: '登录超时，请重新登录',
              complete: function (res) {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              }
            })
          } else if (data.status == '401') {

            
            const pages = getCurrentPages();
            // const current_Page = pages[pages.length - 1];
            //将当前页面的授权弹窗的弹出
            //改变当前页面的Data中的login_show设置为:true
            pages.pop().setData({
              login_show: true
            })
            wx.setStorageSync('login_type', true)
          } else if (data.status == '500') {
            wx.showToast({
              title: '服务器内部异常',
              icon: 'none',
              duration: 3000
            })
          } else if (data.status == 'TIME_OUT') {
            wx.showModal({
              showCancel: false,
              content: '连接超时,请稍候重试',
              complete: function (res) {
                
              }
            })
          } else if (data.code == '500') {
            wx.showModal({
              showCancel: false,
              content: '请求错误,请稍候重试',
              complete: function (res) {
                
              }
            })
          } else if (data.msg){
            wx.showToast({ title: data.msg, icon: 'none' });
          }
        },
        fail: function (res) {
          if (showLoading) {
            wx.hideLoading()
          }
          console.error(res)
          wx.showToast({
            title: 'fail:请求失败！',
            icon: "none",
            duration: 2000
          })
        },
        complete: function (res) {
          if (showLoading) {
            wx.hideLoading()
          }
        }
      })
    })
  }
  //get方法：用来获取数据
  get(url, data) {
    return this.request('get', url, data);
  }
  //post方法：用来更新数据
  post(url, data, config) {
    return this.request('post', url, data, config);
  }
  //put方法
  put(url, data) {
    return this.request('put', url, data);
  }
  //delete方法
  remove(url, data) {
    return this.request('delete', url, data);
  }

}

