/**
 * 请求是否显示加载中
 */
export default class RequestLoadingUtils {
    static initConfig () {
        RequestLoadingUtils.config = {
            "pages/applyPages/hasApplyList/hasApplyList": true,
            "pages/index/index": [
                "minapp/ordersChange/getStatusCount",
                "minapp/unfinishedTask/queryUnfinishedTask",
                "minapp/ordersScrap/queryTodoItem",
            ]
            // "pages/applyPages/hasApplyList/hasApplyList":
            //     [
            //         "minapp/apply/query"
            //     ],
        };
    }

    static config = null

    static getConfig () {
        if (RequestLoadingUtils.config == null) {
            RequestLoadingUtils.initConfig()
        }
        return RequestLoadingUtils.config;
    }

    static isShowLoading (url) {
        const config = RequestLoadingUtils.getConfig()
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length-1] //获取当前页面的对象
        if (currentPage === null || currentPage === undefined) {
            return false
        }
        const currentPageUrl = currentPage.route //当前页面url
        const urlList = config[currentPageUrl]
        if (urlList) {
            if (typeof urlList === 'boolean') {
                return true
            } else {
                // url 处理 url:/assets-m/minapp/msg/queryMyMsg
                let endIndex = url.indexOf("?")
                if (endIndex === -1) {
                    endIndex = url.length
                }
                url = url.substring(1)
                url = url.substring(url.indexOf("/")+1,endIndex)
                console.log(url)
                if (urlList.indexOf(url)>=0) {
                    return true
                }
            }
        }
        return false
    }

}
