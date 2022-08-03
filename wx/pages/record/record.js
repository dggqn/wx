Page({
  data: {
    tmpfile:'',
    time:'',
    query:{}
  },
  onLoad:function(options){
    console.log(options);
    this.setData({
      query:options
    })
    console.log(this.data.query);
  },
  record: function(e){
    var that = this;
    const starttime = Date.now();
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function(res){
      console.log(res)//错误信息自己判断
    })
    this.recorderManager.onStop(function(res){
      that.setData({
        tmpfile: res.tempFilePath,
        time: Date.now() - starttime,
      })
    })
    this.recorderManager.start({
      format:"mp3"
    })
    setTimeout(function(){
      that.recorderManager.stop();
    },10000);
  },
  stopRecord:function(e){
    console.log("stop")
    this.recorderManager.stop();
  },
  upload:function(){
    console.log("开始上传",this.data.time)
    wx.uploadFile({
      filePath: this.data.tmpfile, //录音文件
      name: 'name',
      url: '后台接口',
      format:{
        audio_ms: this.data.time,//时间长
      }
    })
  },
  backMain(){
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },
  onShow(){
    console.log("onshow......");
  },
  onReady(){
    console.log("onready.......");
  },
  onHide(){
    console.log("onhide......");
  },
  onUnload(){
    console.log("onUnload......");
  }
})