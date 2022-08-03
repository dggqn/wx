/**
 * 工具类
 */
export default class Utils {
  static aliyunBaseImgUrlPre = 'https://hospital-assets-image-public.oss-cn-shanghai.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E4%B8%8A%E6%B5%B7%E7%AC%AC%E5%9B%9B%E4%BA%BA%E6%B0%91%E5%8C%BB%E9%99%A2/'

  static aliyunBaseImgUrlPreNew = 'https://hospital-assets-image-public-dev.oss-cn-shanghai.aliyuncs.com/'

  static setUserInfo(userInfo) {
    wx.setStorage({
      data: userInfo,
      key: 'hospital-userInfo',
    })
  }

  static removeUserInfo() {
    wx.removeStorageSync('hospital-userInfo')
  }

  /**
   * 当前登录用户信息
   */
  static getUserInfo() {
    return wx.getStorageSync('hospital-userInfo')
  }

  /**
   * 判断是否是部门主管
   * @returns {boolean}
   */
  static judgeDepartmentManager() {
    const userInfo = Utils.getUserInfo()
    if(userInfo.manageDepts && userInfo.manageDepts.length > 0 && userInfo.userIdentity === 2){
      return true
    }else{
      return false;
    }
  }

  /**
   * 获取用户所在部门
   */
  static getUserDepartName() {
    var userInfo = this.getUserInfo()
    var deptNames = ''
    if (!userInfo.userDepts) {
      return deptNames
    }
    for (var i = 0; i < userInfo.userDepts.length; i++) {
      deptNames += userInfo.userDepts[i].deptName + ','
    }
    if (deptNames != '') {
      deptNames = deptNames.substring(0, deptNames.length - 1)
    }
    return deptNames
  }

  /**
   * 获取用户所在部门的地址
   */
  static getUserDepartAddress() {
    var userInfo = this.getUserInfo()
    var address = ''
    if (!userInfo.userDepts) {
      return address
    }
    for (var i = 0; i < userInfo.userDepts.length; i++) {
      if (userInfo.userDepts[i].address) {
        address += userInfo.userDepts[i].address + ','
      }
    }
    if (address != '') {
      address = address.substring(0, address.length - 1)
    }
    return address

  }

  static setOpenId(openId) {
    wx.setStorage({
      data: openId,
      key: 'hospital-openId',
    })
  }

  static removeOpenId() {
    wx.removeStorageSync('hospital-openId')
  }

  static getOpenId() {
    return wx.getStorageSync('hospital-openId')
  }

  static getStrByArr(array) {
    let arr = []
    array.forEach(item => {
      arr.push(item.url)
    })
    return arr.join("||")
  }
  
  static getImageArrByStr(str) {
    let arr = []
    if(str){
      let strArr =str.split('||')
      strArr.forEach((item,) => {
        arr.push({url:item})
      })
    }
    return arr
  }
  static getVoiceArrByStr(str) {
    let arr = []
    if(str){
      let strArr =str.split('||')
      console.log(strArr)
      strArr.forEach((item,index) => {
        arr.push({url:item,id:index+1})
      })
    }
    return arr
  }
}
