// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    rows: [0,1,2,3,4,5], // 日历一共6行
    dates: [],
    comeDate: null, // 父组件点击传过来的日期
    selectedDay: null // 当前点击的日期
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeDay (e) {
      const clickDay = e.target.dataset.day
      if (!clickDay.currentMonth) {
        return
      }
      this.setData({
        selectedDay: clickDay.day
      })
    },
    // 根据传值创建日历
    creatCalendar (argDate) {
      this.setData({
        comeDate: this.validDate(argDate)
      })
      this.createMonthTable(this.data.comeDate) // 设置选择月的表

    },
    validDate(date) {
      if (typeof date === 'string') {
        const year = date.split('-')[0]
        const month = date.split('-')[1]
        date = new Date(year, month, 0)
      }
      return date
    },
    // 将当前月的加进去
    createMonthTable (argDate) {
      const year = argDate.getFullYear() //年
      const month = argDate.getMonth() //月
      const currentMonthDays = new Date(year, month + 1, 0).getDate() // 获取当前月有多少天
      const tempArr = []
      for (let i = 0; i < currentMonthDays; i++) { // 加进去当前月
        tempArr.push({
          date: year + '-' + (month + 1) + '-' + (i+1),
          year: year,
          month: (month + 1),
          currentMonth: true,
          day: (i + 1)
        })
      }
      const firstDayWeek = new Date(year, month, 1).getDay() // 当前月第一天是周几,有几天前面添加几天
      const lastMonth = new Date(year, month - 1, 1) // 上个月
      const lastMonthDays = new Date(year, month, 0).getDate() // 上个月有多少天
      for (let k = 0; k < firstDayWeek; k++) { // 加进去上个月
        tempArr.unshift({
          date: lastMonth.getFullYear() + '-' + (lastMonth.getMonth() + 1) + '-' + (lastMonthDays - k),
          year: lastMonth.getFullYear(),
          month: (lastMonth.getMonth() + 1),
          currentMonth: false,
          day: (lastMonthDays - k)
        })
      }
      const nextMonth = new Date(year, month + 1, 1) // 下个月
      const leftDays = 42 - currentMonthDays - firstDayWeek
      for (let m = 0; m < leftDays; m++) {
        tempArr.push({
          date: nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1) + '-' + (m + 1),
          year: nextMonth.getFullYear(),
          month: (nextMonth.getMonth() + 1),
          currentMonth: false,
          day: (m + 1)
        })
      }
      this.setData({
        dates: tempArr
      })
    }
  }
})
