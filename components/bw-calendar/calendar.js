import Lunar from './lunar.js'
import Moment from 'moment'

Number.prototype._fixNum = function() {
	return (this < 10 ? '0' : '') + this;
}

const calendar = {

	_initMoment(timeStr) {
		return Moment(timeStr)
	},

	//返回 moment 对象
	_getCurrentDate() {
		return Moment()
	},

	/**
	 * 是否是周末
	 * @method isWeekend
	 * @param {String} date
	 * @return {Boolean}
	 */
	_isWeekend(date) {
		const day = new Date(date.replace(/-/g, '/')).getDay();
		return day === 0 || day === 6;
	},

	/**
	 * 是否是今天
	 * @method isToday
	 * @param {String} date
	 * @return {Boolean}
	 */
	_isToday(today, date) {
		return Format.getTime(today) === Format.getTime(date);
	},

	/**
	 * 检查是否是闰年
	 * @method _checkLeapYear
	 * @param {Number} y 年份
	 * @param {Date} t today
	 * @protected
	 */
	_getMonthDays(y, t) {
		const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		const year = y || t.getFullYear();
		let isLeapYear = false;

		if (year % 100) {
			isLeapYear = !(year % 4);
		} else {
			isLeapYear = !(year % 400);
		}

		if (isLeapYear) {
			MONTH_DAYS[1] = 29;
		} else {
			MONTH_DAYS[1] = 28;
		}
		return MONTH_DAYS;
	},

	_isDate(obj) {
		const type = obj === null ? String(obj) : {}.toString.call(obj) || 'object';
		return type === '[object date]';
	},

	//type 0 不包含上个月和下个月的天数 1包含上个月和下个月天数
	_initDateObjectOther(m) {
		if (!(m instanceof Moment)) {
			console.log('error: 时间类型必须为moment类型')
			return
		}
		let now = Moment()
		let year = m.year()
		let month = m.month()

		let first = Moment(m).startOf('month') //当月第一天
		let last = Moment(m).endOf('month') //当月最后一天
		let firstWeek = first.day()
		let lastWeek = last.day()

		var days = []
		//如果第一天是周日， 加入6天上个月的天数， 不是就加入对应的天数
		//获取上个月
		let prevM = calendar._getMomentPrev(m)
		let prevCount = firstWeek == 0 ? 6 : firstWeek - 1
		for (var i = prevM.daysInMonth() - prevCount; i < prevM.daysInMonth(); i++) {
			let timeStr = prevM.year() + '-' + (prevM.month() + 1)._fixNum() + '-' + i._fixNum()
			days.push({
				day: i,
				year: prevM.year(),
				month: prevM.month() + 1,
				lunar: Lunar.solar2lunar(prevM.year(), prevM.month(), i),
				timeStr: timeStr,
				week: Moment(timeStr).day(),
				isToday: false,
				currentMonth: false,
				prev: true, //是否上个月
				next: false, //是否下个月
			})
		}

		for (var i = 1; i < m.daysInMonth() + 1; i++) {
			let timeStr = year + '-' + (month + 1)._fixNum() + '-' + i._fixNum()
			days.push({
				day: i,
				year: year,
				month: month + 1,
				lunar: Lunar.solar2lunar(year, month, i),
				timeStr: timeStr,
				week: Moment(timeStr).day(),
				isToday: (year == now.year() && month == now.month() && i == now.date()),
				currentMonth: true, //是否本月
				prev: false, //是否上个月
				next: false //是否下个月
			})
		}

		//获取下个月
		let nextM = calendar._getMomentNext(m)
		//最后一天是周六
		let nextCount = lastWeek == 0 ? 0 : (7 - lastWeek)
		for (var i = 1; i < nextCount + 1; i++) {
			let timeStr = nextM.year() + '-' + (nextM.month() + 1)._fixNum() + '-' + i._fixNum()
			days.push({
				day: i,
				year: nextM.year(),
				month: nextM.month() + 1,
				lunar: Lunar.solar2lunar(nextM.year(), nextM.month(), i),
				timeStr: timeStr,
				week: Moment(timeStr).day(),
				isToday: false,
				currentMonth: false,
				prev: false, //是否上个月
				next: true //是否下个月
			})
		}




		return {
			m: m,
			date: m.toDate(),
			year: year,
			month: month + 1,
			days: days, //一个月天数数组
			prevDays: firstWeek, //包含几天上一个月的天数
			nextDays: 6 - lastWeek, //包含几天下一个月的天数
			amountDays: days.length //firstWeek + days.length + 6 - lastWeek
		}
	},

	//获取周一开始的当月天数， 上面那个方法获取的是周日开始的天数
	_initDateObject(m) {
		if (!(m instanceof Moment)) {
			console.log('error: 时间类型必须为moment类型')
			return
		}
		let now = Moment()
		let year = m.year()
		let month = m.month()

		let first = Moment(m).startOf('month') //当月第一天
		let last = Moment(m).endOf('month') //当月最后一天
		let firstWeek = first.day()
		let lastWeek = last.day()
		var days = []

		//获取上个月
		let prevM = calendar._getMomentPrev(m)
		for (var i = prevM.daysInMonth() - firstWeek; i < prevM.daysInMonth(); i++) {
			let timeStr = prevM.year() + '-' + (prevM.month() + 1)._fixNum() + '-' + i._fixNum()
			days.push({
				day: i,
				year: prevM.year(),
				month: prevM.month() + 1,
				lunar: Lunar.solar2lunar(prevM.year(), prevM.month(), i),
				timeStr: timeStr,
				week: Moment(timeStr).day(),
				isToday: false,
				currentMonth: false,
				prev: true, //是否上个月
				next: false, //是否下个月
			})
		}

		for (var i = 1; i < m.daysInMonth() + 1; i++) {
			let timeStr = year + '-' + (month + 1)._fixNum() + '-' + i._fixNum()
			days.push({
				day: i,
				year: year,
				month: month + 1,
				lunar: Lunar.solar2lunar(year, month, i),
				timeStr: timeStr,
				week: Moment(timeStr).day(),
				isToday: (year == now.year() && month == now.month() && i == now.date()),
				currentMonth: true, //是否本月
				prev: false, //是否上个月
				next: false //是否下个月
			})
		}

		//获取下个月
		let nextM = calendar._getMomentNext(m)
		for (var i = 1; i < 6 - lastWeek + 1; i++) {
			let timeStr = nextM.year() + '-' + (nextM.month() + 1)._fixNum() + '-' + i._fixNum()
			days.push({
				day: i,
				year: nextM.year(),
				month: nextM.month() + 1,
				lunar: Lunar.solar2lunar(nextM.year(), nextM.month(), i),
				timeStr: timeStr,
				week: Moment(timeStr).day(),
				isToday: false,
				currentMonth: false,
				prev: false, //是否上个月
				next: true //是否下个月
			})
		}

		return {
			m: m,
			date: m.toDate(),
			year: year,
			month: month + 1,
			days: days, //一个月天数数组
			prevDays: firstWeek, //包含几天上一个月的天数
			nextDays: 6 - lastWeek, //包含几天下一个月的天数
			amountDays: days.length //firstWeek + days.length + 6 - lastWeek
		}
	},

	_getMomentPrev(m) {
		if (!(m instanceof Moment)) {
			console.log('error: 时间类型必须为moment类型')
			return
		}
		let tmpM = Moment(m).add(-1, 'months')
		return tmpM
	},

	_getMomentNext(m) {
		if (!(m instanceof Moment)) {
			console.log('error: 时间类型必须为moment类型')
			return
		}
		let tmpM = Moment(m).add(1, 'months')
		return tmpM
	},

	/*
	    date: Date
	    return '2019-02-28'
	*/
	currentDateStr(date) {
		if (!(date instanceof Date)) {
			console.log('error: 时间类型必须为Date类型')
			return
		}
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var monthStr = ''
		if (month < 10) {
			monthStr = '0' + month
		} else {
			monthStr = month.toString()
		}
		var day = date.getDate()
		var dayStr = ''
		if (day < 10) {
			dayStr = '0' + day
		} else {
			dayStr = day.toString()
		}
		return year + '-' + monthStr + '-' + dayStr
	},
}

export default calendar
