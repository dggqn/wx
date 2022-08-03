/**
 * 扫码解析工具类
 */
export default class ScanAnalysisUtils {
    /**
     * 分析扫描内容
     * @param scanContent 所扫码的内容
     */
    static analysisScanContent(scanContent, jumpType) {
        if (scanContent == null || scanContent.trim() == '') {
            return;
        }
        const paramMap = ScanAnalysisUtils.getParams(scanContent);
        if (paramMap.type == 'deliver') {
            const url = '/pages/applyPages/deliverDetail/deliverDetail?entityId=' + paramMap.id;
            ScanAnalysisUtils.goAimPages(url, jumpType)
        } else if (paramMap.type == 'asset') {
            const url = '/pages/assetsRecordFolder/assetsDetails/assetsDetails?assetBarcode=' + paramMap.assetBarcode;
            ScanAnalysisUtils.goAimPages(url, jumpType)
        } else if (paramMap.type == 'location') {
            const url = '/pages/positionCodePages/PositionCode/PositionCode?locationCode=' + paramMap.locationCode;
            ScanAnalysisUtils.goAimPages(url, jumpType)
        } else {
            wx.showToast({
                title: '无法识别的二维码',
                icon: 'none'
            });
        }
    }
    /**
     * 若字符串以特定内容开头则获取扫码内容中的参数，否则设置type为asset
     * @param scanContent 所扫码的内容
     */
    static getParams(scanContent) {
        if (scanContent == null || scanContent.trim() == '') {
            return {};
        }
        let paramMap = {};
        if (scanContent.startsWith("http")) {
            const paramStr = scanContent.split('?')[1]
            const paramArray = paramStr.split("&")
            for (let i = 0; i < paramArray.length; i++) {
                const param = paramArray[i]
                const key = param.split('=')[0]
                const value = param.split('=')[1]
                paramMap[key] = value;
            }
        } else if (scanContent.startsWith("location_")) {
            const paramStr = scanContent.split('_')[1]
            // const paramArray = paramStr.split("&")
            paramMap.type = "location";
            paramMap.locationCode = paramStr;
            console.log(paramMap);
        } else {
            paramMap.type = "asset";
            paramMap.assetBarcode = scanContent
        }
        return paramMap
    }

    static getAssetBarcode(scanContent) {
        const paramMap = ScanAnalysisUtils.getParams(scanContent);
        if (paramMap.type == "asset") {
            return paramMap.assetBarcode
        }
        return scanContent
    }
    /**
     * 跳转至目标路径
     * @param url 路径
     * @param jumpType 跳转类型
     */
    static goAimPages(url, jumpType) {
        if (jumpType == "navigateTo") {
            wx.navigateTo({
                url: url
            })
        } else if (jumpType == "redirectTo") {
            wx.redirectTo({
                url: url
            })
        } else {
            wx.navigateTo({
                url: url
            })
        }
    }

}