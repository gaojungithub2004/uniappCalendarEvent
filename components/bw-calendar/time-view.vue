<template>
	<picker style="margin-bottom: 40upx; margin-left: 40upx;" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" fields="month">
		<view class="uni-input">{{dateStr}}</view>
	</picker>
</template>

<script>
	
	import calendar from './calendar.js'
	
	export default {

		props: {
			current: {
				type: Object,
				default: null
			}
		},

		watch: {
			
			current(newValue) {
				this.date = newValue.year + '-' + newValue.month._fixNum()
			},
			
			date(newValue){
				let year = newValue.substring(0, 4)
				let month = parseInt(newValue.substring(5, 7))
				this.dateStr = year + '年' + month._fixNum() + '月'
			}
		},
		
		created() {
			// this.date = this.current.year + '-' + this.current.month._fixNum()
			this.dateStr = this.current.year + '年' + this.current.month._fixNum() + '月'
		},

		data() {
			return {
				date: null,
				dateStr: null,
				startDate: '2010-01-01',
				endDate: '2030-12-31'
			}
		},

		methods: {
			bindDateChange: function(e) {
				console.log(e.target)
				this.date = e.target.value
				this.$emit('updateTime', calendar._initMoment(e.target.value))
			},
		}
	}
</script>

<style>
</style>
