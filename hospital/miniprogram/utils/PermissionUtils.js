import Config from "../config/index"

export default class PermissionUtils {
  /**
   * 判断是否有某个权限
   * @param {p} permissions 
   * @param {*} authority 
   */
  static hasPermission(permissions, authority) {
    var hasPermission = false
    if (Config.env.ENV === 'local') {
      return true
    }
    for (var permission of permissions) {
      if (permission.authority === authority) {
        hasPermission = true
        break
      }
    }
    return hasPermission
  }

}