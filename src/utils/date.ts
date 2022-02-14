export function dateFormat(date: Date, fmt: string) {
  if (!date) return
  const o: { [key: string]: number | any } = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds() // 秒
  }
  if (/(y+)/.test(fmt)) {
    // 根据y的长度来截取年
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  console.log('dateFormat:', o, fmt)
  return fmt
}

/**
 *
 * @description 拿到前一天的时间戳，如 2021年5月22日-2021年5月23日
 * @export
 * @return { start, end, startText, endText }
 */
export function getYesterday() {
  const start = new Date(), // 当前时间戳
    end = new Date()
  start.setTime(start.setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1)
  // 这里为什么 * 999 是因为后端好像只想要一个数据，如 2021年5月23日 00:00 - 2021年5月23日 24:00，如果 *24 就已经换天了
  end.setTime(start.getTime() + 3600 * 999 * 24 * 1)
  const startText = dateFormat(start, 'yyyy-MM-dd hh:mm:ss'),
    endText = dateFormat(end, 'yyyy-MM-dd hh:mm:ss')
  console.log(`normal.js:`, startText, endText)
  return { start, end, startText, endText }
}

/**
 *
 * @description 拿到今天的时间
 * @export
 * @return { start, end, startText, endText }
 */
export function getToday() {
  const start = new Date(),
    end = new Date()
  start.setTime(start.setHours(0, 0, 0, 0))
  end.setTime(end.getTime())
  const startText = dateFormat(start, 'yyyy-MM-dd hh:mm:ss'),
    endText = dateFormat(end, 'yyyy-MM-dd hh:mm:ss')
  console.log(`normal.js:`, startText, endText)
  return { start, end, startText, endText }
}

/**
 *
 * @description 拿到一周的时间
 * @export
 * @return {{ start, end, startStamp, endStamp, startText, endText }}
 */
export function getAWeek() {
  const s = new Date(),
    start = new Date(),
    end = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
  const startStamp = s.getTime() - 3600 * 1000 * 24 * 7,
    endStamp = s.getTime() + 3600 * 1000 * 24 * 7,
    startText = dateFormat(start, 'yyyy-MM-dd hh:mm:ss'),
    endText = dateFormat(end, 'yyyy-MM-dd hh:mm:ss')
  return { start, end, startStamp, endStamp, startText, endText }
}

/**
 *
 * @description 传入中国标准时间 得到 yyyy-mm-dd
 * @export
 * @return {{`${standard.getFullYear()}-${standard.getMonth() + 1}-${standard.getDate()}`}}
 */
export function getYearMonthDay(times: string | number) {
  let standard = new Date(times)
  return `${standard.getFullYear()}-${standard.getMonth() + 1}-${standard.getDate()}`
}

/**
 * @description: 将yyyy-mm-dd转化为毫秒
 * @param {Date} dateTime
 * @return {{millisecond}}
 */
export function getMillisecond(dateTime: string) {
  var newTime = ''
  newTime = dateTime.replace(/-/g, '/')
  const millisecond = new Date(newTime).getTime()
  return millisecond
}

/**
 *
 * @description 拿到指定月的天数
 * @export
 * @param {*} year 默认是当前年
 * @param {*} month 默认是当前月
 * @returns {number} days
 */
export function getCurMonthDays(year: number, month: number) {
  let d = new Date()

  year = year || d.getFullYear()

  month = month || d.getMonth() + 1

  d = new Date(year, month, 0)

  const days = d.getDate()

  console.log('getCurMonthDays:', year, month, days)

  return days
}

/**
 *
 * @description 拿到指定月的第一天是周几
 * @export
 * @param {*} year 默认是当前年
 * @param {*} month 默认是当前月
 * @returns {number} firstDay
 */
export function getWeekFristDayInMonth(year: number, month: number) {
  // Date()构造函数有四种基本形式
  // - 不传参
  // - 传unix时间戳
  // - 按参数位置传入的话，Date 会按照 0-11 的策略来进行计算，导致如果传入的 8 那么实际上是计算的 9 月
  // - 传时间戳字符串 2020-8-10
  // var d = new Date(`${year} , ${month} , 1`);
  let d = new Date()

  year = year || d.getFullYear()

  month = month || d.getMonth() + 1

  d = new Date(year, month - 1, 1)

  const firstDay = d.getDay()

  console.log('getWeekFristDayInMonth:', year, month, firstDay)

  return firstDay
}
