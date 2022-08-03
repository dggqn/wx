/**
 * 订阅消息
 */

 export default class SubscribeMessageUtils {

  static getAllMessageType () {
     const obj = {
       collar: '0tf_x8-88R9LiQtD-kGa35sNYr9aaQypoDhqhbJkL4I', //领用通知
       sign: 'yWV1AveWW_Fo3MJ79sRQDG-V-pn3IgciXn7enhYybrQ', //签收通知
       ship: 'XXSKLBeNGbq6ElhiBTkEdfpZ7bIiFAF21bAm3VItbIM', //供应商发货通知
       cancelCollar: 'VaYdBoTz1psXv95w71N4bFE8RoUX8CTpoWUEKE7v7bg', //取消申领
       collarInvalid: '1h3BWMig8ywk8mUSIQhb_UMRhecAJ1TG7rMiffriyKw', //领用单失效通知
       refundApprovalPass: 'rdS2Ip9_jVunVQWqeedA4QIM2-XOovC6O9-YEEbXoVE', //审批结果-通过
       refundApprovalRefuse: 'rdS2Ip9_jVunVQWqeedA4f9UFtrDVIXChqn2GdK0OZU' //审批结果-驳回
     }
     return obj
   }

  static getMessageTypeKeyList () {
    const obj = SubscribeMessageUtils.getAllMessageType()
    const keyList = []
    for (let key in obj) {
      keyList.push(key)
    }
    return keyList
  }

   static getMessageType (key) {
     const obj = SubscribeMessageUtils.getAllMessageType()
     return obj[key]
   } 
   /**
    * 消息订阅
    */
   static subscribeMessage(tmplIds, fn) {
    wx.requestSubscribeMessage({
      tmplIds: tmplIds,
      complete: function (resp) {
        console.info('订阅消息返回:' + JSON.stringify(resp))
        if (resp.errCode == '20004') {
          wx.showModal({
            title: '消息订阅失败',
            icon: 'none',
            content: '请在设置中打开消息订阅开关',
          })
        } else {
          if (resp.errMsg === 'requestSubscribeMessage:ok') {
            fn()
          }
        }
      }
    })
  }
 }
