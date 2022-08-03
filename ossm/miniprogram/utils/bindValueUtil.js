/**
 * 绑定工具类
 */
export default class bindValueUtil {
    static viewValueChange (_this,e) {
        if(e.currentTarget.dataset.path){
            const pathArray = e.currentTarget.dataset.path.split(".")
            const length = pathArray.length
            let aimObj = _this.data
            for (var i = 0; i < length-1; i++) {
                aimObj = aimObj[pathArray[i]]
            }
            let value = e.detail.value
            let sync = false
            if(e.currentTarget.dataset.minvalue){
                if(parseInt(e.currentTarget.dataset.minvalue)>parseInt(value)){
                    value = parseInt(e.currentTarget.dataset.minvalue)
                    sync = true
                }
            }
            if(e.currentTarget.dataset.maxvalue){
                if(parseInt(e.currentTarget.dataset.maxvalue)<parseInt(value)){
                    value = parseInt(e.currentTarget.dataset.maxvalue)
                    sync = true
                }
            }
            aimObj[pathArray[length-1]] = value

            if(e.currentTarget.dataset.arrayremovevalue){
                if(parseInt(e.currentTarget.dataset.arrayremovevalue)==parseInt(value)){
                    let aimRemoveObj = _this.data
                    for (var i = 0; i < length-3; i++) {
                        aimRemoveObj = aimRemoveObj[pathArray[i]]
                    }
                    aimRemoveObj[pathArray[length-3]].splice(pathArray[length-2],1)
                    sync = true
                }
            }
            if(sync){
                const syncData = {}
                syncData[pathArray[0]] = _this.data[pathArray[0]]
                _this.setData(syncData)
            }
        }
    }
}
