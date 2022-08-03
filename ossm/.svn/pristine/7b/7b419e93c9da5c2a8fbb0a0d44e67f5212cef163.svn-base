export default class ApplyCalendarData {
  // 获取月份
  static getMonths (argYear) {
    const months = []
    const currentYear = new Date().getFullYear()
    let monthNum = new Date().getMonth() + 1
    if (currentYear !== parseInt(argYear)) {
      monthNum = 12
    }
    for (let i = 1; i <= monthNum; i++) {
      months.push(i + '月')
    }
    return months
  }
}