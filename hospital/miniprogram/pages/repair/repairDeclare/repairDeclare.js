// pages/repair/repairDeclare/repairDeclare.js
import Utils from '../../../utils/utils'
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    press:true,
    aliyunBaseImgUrlPreNew: Utils.aliyunBaseImgUrlPreNew,
    no:0,
    startTime:0,
    seconds:0,
    voiceIco: '../../images/voice.png',
    durationShow: '',    
    recordStatus: false, //录音状态
    audioIn: false,
    send: true,
    aliyunBaseImgUrlPre: Utils.aliyunBaseImgUrlPre,
    tab: '1',
    current: 1,
    pageSize: 10,
    showAssetFlag: false,
    repairList: [], // 报修单列表
    ID: '', //扫码识别出的ID
    AssetDetail: {}, //资产信息
    issueTextarea: '', // 问题描述
    ContactName: '张三', // 联系人名称
    phoneNumber: '18362321235', // 电话
    address: '门诊大楼11楼中医内科', // 地址
    textArr: [], // 临时存放被选中的问题
    issueTextList: [{ //选择问题
      code: '0',
      active: false,
      text: '无法开机'
    }, {
      code: '1',
      active: false,
      text: '机器发出异响'
    }, {
      code: '2',
      active: false,
      text: '无法连接设备'
    }, {
      code: '3',
      active: false,
      text: '无法连接网络'
    }],
    fileList: [],
    is_clock: false,
    objectDeptArr: [],
    deptIndex: 0,
    deptEntityId: '',
    voice: '',
    voiceList: [],
    multiArray: [],
    multiIndex: [0, 0]
  },
  /**
   * 获取资产信息
   */
  getAssetDetail() {
    let that = this;
    console.log(this.data);
    app.http.post('/assets/app/asset/getByEntityId', that.data.ID).then(data => {
      // console.info(data);
      var msg = that.data.AssetDetail
      msg.name = data.assetName
      msg.img = data.displayImgUrl
      // msg.buyingDate = data.buyingDate
      // msg.buyingPrice = data.buyingPrice
      that.setData({
        AssetDetail : msg,
        //showAssetFlag: true // 显示弹窗
      })
    })
  },
  afterRead(event) {
      const that = this
      const {file} = event.detail;
      console.log(event)
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
              console.log(this.data.fileList)
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
  chooseIssue(e) {
    let item = e.currentTarget.dataset.item;
    let bool = !this.data.issueTextList[item.code].active
    if (bool && (this.data.textArr.indexOf(item.text) < 0)) { //选择状态，且数组中没有该项则把该项添加到数组
      console.log(item.text)
      this.data.textArr.push(item.text);
    } else { // 未选中状态则将其从数组中移除
      let arrIndex = this.data.textArr.indexOf(item.text); // 检索并获取该项的索引
      if (arrIndex > -1) { // 如果检索到该项，则将其移除
        this.data.textArr.splice(arrIndex, 1);
      }
    }
    this.data.issueTextList[item.code].active = bool; // 由于setdata中没法直接访问对象中的元素，所以先改变值再触发渲染
    // 以下是拼接问题，填入文本域中，但会覆盖用户输入内容
    let text = '';
    this.data.textArr.forEach(i => {
      text = text + i + '#';
    })
    console.log(text)
    this.setData({
      issueTextList: this.data.issueTextList,
      issueTextarea: text
    })
  },
  IDchange(e) {
    if (e.detail.cursor == 0 || this.data.ID == e.detail.value) return;
    this.data.ID = e.detail.value;
    this.getAssetDetail();
  },
  issueTextareaChange(e) {
    this.data.issueTextarea = e.detail.value;
    console.log(this.data.issueTextarea)
  },
  ContactNameChange(e) {
    this.data.ContactName = e.detail.value;
  },
  phoneNumberChange(e) {
    this.data.phoneNumber = e.detail.value;
  },
  addressChange(e) {
    this.data.address = e.detail.value;
  },
  /**
   * 获取我的报修单列表
   */
  getPepairOrder() {
    wx.navigateTo({
      url: '/pages/repair/repairList/repairList',
    })
  },
  showDeclareAsset() {
    let that = this;
    wx.scanCode({ //调用扫码功能
      scanType: ['barCode', 'qrCode'],
      success(res) {
        console.log(res)
        that.setData({
          ID: res.result,
        });
        //根据ID获取资产信息
        that.getAssetDetail();
      }
    })

  },
  cancelChooseAsset() {
    this.setData({
      showAssetFlag: false
    })
  },
  /**
   * 提交报修单
   */
  updateDeclare(e) {
    console.log(e.currentTarget.dataset.type)
    let status  = '1'
    if(e.currentTarget.dataset.type == 'btn1'){
      status  = '0'
    }
    let that = this;
    console.log(that.data.fileList)
    console.log({
      'assetsId': that.data.ID, //资产id
      'description': that.data.issueTextarea, //任务描述
      'linkman': that.data.ContactName, //姓名
      'linktel': that.data.phoneNumber, //电话
      'position': that.data.address, //地址
      'image': Utils.getStrByArr(that.data.fileList), //照片
      'voice':  Utils.getStrByArr(that.data.voiceList), //语音
      'status': status, //语音
      'serviceTeam': that.data.deptEntityId //部门
    })
    if(this.data.deptEntityId){
      let url = "/assets/app/task/"
      if(status  == '0'){
        app.http.post(url+'update', {
          'assetName':that.data.assetName,//资产名称
          'assetPic':that.data.displayImgUrl,//资产图片
          'assetsId': that.data.ID, //资产id
          'description': that.data.issueTextarea, //任务描述
          'linkman': that.data.ContactName, //姓名
          'linktel': that.data.phoneNumber, //电话
          'position': that.data.address, //地址
          'image': Utils.getStrByArr(that.data.fileList), //照片
          'voice':  Utils.getStrByArr(that.data.voiceList), //语音
          'status': status, //语音
          'serviceTeam': that.data.deptEntityId, //部门
          'taskId': that.data.taskId
        }).then(data => {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            that.getPepairOrder();
          }, 1500)
        })
      }else if(status  == '1'){
        app.http.post(url+'insert', {
          'assetName':that.data.assetName,//资产名称
          'assetPic':that.data.displayImgUrl,//资产图片
          'assetsId': that.data.ID, //资产id
          'description': that.data.issueTextarea, //任务描述
          'linkman': that.data.ContactName, //姓名
          'linktel': that.data.phoneNumber, //电话
          'position': that.data.address, //地址
          'image': Utils.getStrByArr(that.data.fileList), //照片
          'voice':  Utils.getStrByArr(that.data.voiceList), //语音
          'status': status, //语音
          'serviceTeam': that.data.deptEntityId //部门
        }).then(data => {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            that.getPepairOrder();
          }, 1500)
        })
      }
    }else{
      wx.showToast({
        title: '请选择部门!',
        icon: 'error',
        duration: 1500
      })
    }
  },
  hideAudioIn: function () {
    this.setData({
      audioIn: false,
      send: true
    })
  },
  /**
     * 按住按钮开始语音识别
     */
  streamRecord: function (e) {
    this.setData({
      press:false
    })
    console.log(this.data.voiceList.length)
    if(this.data.voiceList.length<3){
        this.recorderManager.start({
        duration: 60000,
        sampleRate: 16000, //采样率，有效值 8000/16000/44100
        numberOfChannels: 1, //录音通道数，有效值 1/2
        encodeBitRate: 96000, //编码码率
        format: 'mp3', //音频格式，有效值 aac/mp3
        frameSize: 50, //指定帧大小
        audioSource: 'auto' //指定录音的音频输入源，可通过 wx.getAvailableAudioSources() 获取
      })
      // 开始录音计时
      this.setData({
        startTime: new Date()
      })
      // setInterval(function(){
      //   startTime:this.data.startTime+1
      //   console.log(this.data.startTime);
      // },10000)
    }
  },

  /**
   * 松开按钮结束语音识别
   */
  streamRecordEnd: function (e) {
    this.setData({
      press:true
    })
    console.log("streamRecordEnd", e)
    this.recorderManager.stop()
  },
  //播放录音
  play: function (e) {
    console.log(e);
    // 获取innerAudioContext实例
    const innerAudioContext = wx.createInnerAudioContext()
    // 是否自动播放
    innerAudioContext.autoplay = true
    // 设置音频文件的路径
    innerAudioContext.src = this.data.voiceList[e.currentTarget.dataset.key-1].url;
    // 播放音频文件
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    });
    // 监听音频播放错误事件
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  Cancel() {
    wx.showToast({
      title: '已取消',
      icon: 'success',
      duration: 2000
    });
    this.getPepairOrder();
  },
  goRemark() {
    wx.navigateTo({
      url: '../repairFeedback/repairFeedback',
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    this.data.deptList.forEach((item,index) => {
      if(e.detail.value[0]==index){
        item.deptTreeList.forEach((itemChild,indexChild) => {
          if(e.detail.value[1]==indexChild){
            this.setData({
              deptEntityId: itemChild.deptId
            })
          }
        })
      }
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    let dept = this.data.deptList[data.multiIndex[0]]
    let nameArray = []
    dept.deptTreeList.forEach((item,index) => {
      nameArray.push(item.deptName)
    })
    data.multiArray[1] = nameArray;
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取部门信息
    let that = this;
    if(!options.itemDetail){
      this.setData({
        submitType: 'add'
      })
    }else{
      let detail = JSON.parse(options.itemDetail)
      console.log(detail)
      this.setData({
        'ID': detail.assetsId,
        'issueTextarea': detail.description,
        'ContactName': detail.linkman,
        'phoneNumber': detail.linktel,
        'address': detail.position,
        'fileList': Utils.getImageArrByStr(detail.image),
        'voiceList': Utils.getVoiceArrByStr(detail.voice),
        'status': detail.status,
        'deptEntityId': detail.serviceTeam,
        'taskId': detail.taskId
      })
    }
    app.http.post('/assets/app/task/queryDeptList').then(data => {
      console.log(data)
      let muilArr = []
      let nameArray = []
      let nameArrayChild = []
      let a = 0
      let b = 0
      let ishave = 0
      let deptId = ''
      data.forEach((item,index) => {
        nameArray.push(item.deptName)
        if(this.data.deptEntityId){
          deptId = this.data.deptEntityId
          let childArr = []
          let detaila = JSON.parse(options.itemDetail)
          item.deptTreeList.forEach((itemChild,indexChild) => {
            if(itemChild.deptId == detaila.serviceTeam){
              a=index
              b=indexChild
              ishave = 1
            }
            childArr.push(itemChild.deptName)
          })
          if(ishave==1){
            ishave=0
            nameArrayChild = childArr
          }
        }else{
          if(0==index){
            item.deptTreeList.forEach((itemChild,indexChild) => { 
              if(0==indexChild){
                deptId = itemChild.deptId
              }
              nameArrayChild.push(itemChild.deptName)
            })
          }
        }
      })
      muilArr.push(nameArray)
      muilArr.push(nameArrayChild)
      this.setData({
        deptList: data,
        multiArray: muilArr,
        multiIndex: [a,b],
        deptEntityId: deptId
      })
    })
    let userInfo = Utils.getUserInfo(); // 获取用户信息，用于自动填写表单
    console.log(userInfo)
    this.setData({
      ContactName: userInfo.realName,
      phoneNumber: userInfo.userMobile,
    })
    //获取全局唯一的录音管理器 RecorderManager实例
    that.recorderManager = wx.getRecorderManager()
    that.recorderManager.onStop((res) => {
      that.setData({
        tempFilePath: res.tempFilePath // 文件临时路径
      })
      console.log('获取到文件：' + that.data.tempFilePath)
      //上传录制的音频
      wx.uploadFile({
        url: app.env.url + app.env.assetsUrl + '/oss/upload',
        filePath: that.data.tempFilePath,
        name: 'file',
        header: {
            'Authorization': 'bearer ' + wx.getStorageSync('hospital-token'),
            'Content-Type': 'multipart/form-data'
        },
        formData: {
            'file': that.data.tempFilePath,
            'fileAccessPermission': 'PUBLIC_READ',
            'uploadFileType': 'IMAGE',
        },
        success: (data) => {
          let sec = Math.trunc(parseInt(new Date() - this.data.startTime)/1000)
          const resultData = JSON.parse(data.data).data
          // console.log(resultData);
          that.setData({
            no : that.data.no+1
          })
          const f = {
              url: resultData.url,
              id: that.data.no,
              time:sec,
          }
          wx.hideLoading()
          let voiceArr = []
          if( that.data.voiceList){
            voiceArr = that.data.voiceList
          }
          voiceArr.push(f)
          that.setData({
            voiceList: voiceArr
          })
        },
        fail(res) {
        }
      })
    })
    this.recorderManager.onError((res) => {
      console.log('录音失败了！')
      //console.log(res)
    })
  },
  delete(e){
    let voiceArr = []
    this.setData({
      no : 0
    })
    for(var i =0 ;i < this.data.voiceList.length ;i++){
        let child = this.data.voiceList[i]
        if(child.id != e.currentTarget.dataset.key){
          this.setData({
            no : this.data.no +1
          })
          child.id =  this.data.no
          voiceArr.push(child)
        }
    }
    this.setData({
      voiceList : voiceArr,
    })
  },
  onReachBottom(){
    this.data.current++
    this.getPepairOrder();
    console.log(this.data.current)
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