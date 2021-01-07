<template>
	<view class="wrapper">
		<view class="month-title">
			<time-view :current="current" @updateTime="init" :startDate="startDate" :endDate="endDate"></time-view>
			<view class="week-content">
				<view class="week-item" v-for="(week, i) in weeks" :key="week">{{week}}</view>
			</view>
			<view class="back" :class="[showBack ? 'back-show' : 'back-hide']" @click="backToday">
				<view style="width: 140upx;" v-show="showBack">回到今天</view>
			</view>
		</view>
		<!-- 日历 -->
		<!-- swiper-item 不能封装 -->
		<swiper class="swiper" :vertical="vertical" :current="currentIndex" :style="{height: swiptHeight}" @change="change"
		 @animationfinish="animationfinish" :duration="duration">
			<swiper-item>
				<calendar-view :resData="prev" :day="selectDay" :selectDay.sync="selectDay" @prev="toMonth" @next="toMonth"
				 :displayOtherMonth="displayOtherMonth"></calendar-view>
			</swiper-item>
			<swiper-item>
				<calendar-view :resData="current" :day="selectDay" :selectDay.sync="selectDay" @prev="toMonth" @next="toMonth"
				 :displayOtherMonth="displayOtherMonth"></calendar-view>
			</swiper-item>
			<swiper-item>
				<calendar-view :resData="next" :day="selectDay" :selectDay.sync="selectDay" @prev="toMonth" @next="toMonth"
				 :displayOtherMonth="displayOtherMonth"></calendar-view>
			</swiper-item>
		</swiper>
		<scroll-view class="scroller" :scroll-y="true" :show-scrollbar="false" :style="{height: scrollHeight}">
			<slot></slot>
		</scroll-view>
	</view>
</template>

<script>
	import calendar from './calendar.js'
	import CalendarView from './calendar-view.vue'
	import TimeView from './time-view.vue'

	export default {

		props: {
			
			/*
				是否垂直手势切换
			*/
			vertical: {
				type: Boolean,
				default: true
			},
			/*
				默认高度全屏
				不是全屏可以这么传 '100vh - 50px'
			*/
			pageHeight: {
				type: String,
				default: '100vh'
			},
			/*
				周一开始显示 1
				周日开始显示 0
			*/
			weekType: {
				type: Number,
				default: 0
			},
			/*
				是否显示当月之外的日期
			*/
			displayOtherMonth: {
				type: Boolean,
				default: true
			},

			/*
				picker 可选最早日期
			*/
			startDate: {
				type: String,
				default: '2010-01-01'
			},

			/*
				picker 可选最晚日期
			*/
			endDate: {
				type: String,
				default: '2030-12-31'
			}
		},

		components: {
			CalendarView,
			TimeView
		},

		data() {
			return {
				date: null,
				weeks: [],
				current: null,
				prev: null,
				next: null,
				displayRow: 0, //展示页面行数，调整swipt高度
				currentIndex: 1,
				duration: 300,
				selectDay: null,
				showBack: false
			}
		},

		computed: {

			swiptHeight() {
				return `calc(100vw/7*0.8*${this.displayRow} + 25px)`
			},

			scrollHeight() {
				return `calc(${this.pageHeight} - 100vw/7*0.8*${this.displayRow} - 85px - var(--window-top))`
			}
		},

		watch: {
			current(newValue) {
				var flag = false
				newValue.days.forEach(e => {
					if (e.timeStr == calendar.currentDateStr(new Date()) && e.currentMonth) {
						flag = true
					}
				})
				this.showBack = !flag
			},

			selectDay(newValue, oldValue) {
				//日期改变获取数据
				if (oldValue != newValue) {
					console.log(newValue)
				}
			}
		},



		created() {
			this.weeks = this.weekType == 0 ? ['日', '一', '二', '三', '四', '五', '六'] : ['一', '二', '三', '四', '五', '六', '日']
			let moment = calendar._getCurrentDate()
			this.init(moment)
		},

		methods: {

			backToday() {
				let moment = calendar._getCurrentDate()
				this.init(moment)
			},

			toMonth(m) {
				this.init(m)
			},

			//Monent初始化当前显示月份
			init(moment) {
				if (this.weekType == 1) {
					this.current = calendar._initDateObjectOther(moment)
					this.prev = calendar._initDateObject(calendar._getMomentPrev(moment))
					this.next = calendar._initDateObject(calendar._getMomentNext(moment))
				} else {
					this.current = calendar._initDateObject(moment, 1)
					this.prev = calendar._initDateObject(calendar._getMomentPrev(moment), 1)
					this.next = calendar._initDateObject(calendar._getMomentNext(moment), 1)
				}

				this.selectDay = calendar.currentDateStr(new Date()) //默认选择今天
				this.displayRow = (this.current.amountDays % 7 == 0) ? this.current.amountDays / 7 : (parseInt(this.current.amountDays /
					7) + 1)
			},

			change(e) {
				// console.log(JSON.stringify(e.detail.current))
			},

			animationfinish(e) {
				console.log(JSON.stringify(e.target.current))
				this.currentIndex = e.target.current
				if (this.currentIndex < 1) {
					this.current = this.prev
					setTimeout(e => {
						this.currentIndex = 1
						this.displayRow = (this.current.amountDays % 7 == 0) ? this.current.amountDays / 7 : (parseInt(this.current.amountDays /
							7) + 1)
						this.duration = 0

						if (this.weekType == 1) {
							this.prev = calendar._initDateObjectOther(calendar._getMomentPrev(this.prev.m))
							this.next = calendar._initDateObjectOther(calendar._getMomentPrev(this.next.m))
						} else {
							this.prev = calendar._initDateObject(calendar._getMomentPrev(this.prev.m), 1)
							this.next = calendar._initDateObject(calendar._getMomentPrev(this.next.m), 1)
						}

						setTimeout(e => {
							this.duration = 300
						}, 300)
					}, 50)
				} else if (this.currentIndex > 1) {
					this.current = this.next
					setTimeout(e => {
						this.currentIndex = 1
						this.displayRow = (this.current.amountDays % 7 == 0) ? this.current.amountDays / 7 : (parseInt(this.current.amountDays /
							7) + 1)
						this.duration = 0

						if (this.weekType == 1) {
							this.next = calendar._initDateObjectOther(calendar._getMomentNext(this.next.m))
							this.prev = calendar._initDateObjectOther(calendar._getMomentNext(this.prev.m))
						} else {
							this.next = calendar._initDateObject(calendar._getMomentNext(this.next.m), 1)
							this.prev = calendar._initDateObject(calendar._getMomentNext(this.prev.m), 1)
						}

						setTimeout(e => {
							this.duration = 300
						}, 300)
					}, 50)
				}
			}
		}
	}
</script>

<style scoped>
	.wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		bottom: 0;
	}

	.scroller {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: white;
		transition: height 0.15s linear;
		border-top-left-radius: 50upx;
		border-top-right-radius: 50upx;
		overflow: hidden;
	}

	.swiper {
		position: absolute;
		left: 0;
		top: 160upx;
		width: 100%;
		background-color: #007AFF;
		transition: height 0.15s linear;
	}

	.month-title {
		height: 160upx;
		background-color: #007AFF;
		width: 100vw;
		color: #FFFFFF;
		font-size: 34upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.week-content {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	.week-item {
		width: calc(100vw/7);
		height: 50upx;
		text-align: center;
		font-size: 26upx;
		color: rgba(255, 255, 255, 0.7);
	}

	.back {
		position: absolute;
		right: 10upx;
		top: 20upx;
		height: 60upx;
		width: 140upx;
		background-color: #FFFFFF;
		border-top-left-radius: 30upx;
		border-bottom-left-radius: 30upx;
		transition: width 0.2s ease-in-out;
		color: #333333;
		font-size: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		overflow: hidden;
	}

	.back-show {
		width: 140upx;
	}

	.back-hide {
		width: 0upx;
	}
</style>
