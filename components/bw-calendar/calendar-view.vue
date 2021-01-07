<template>
	<view class="swiper-content">
		<view class="swiper-item" v-for="(item, index) in resData.days" :key="'current'+index" :class="[item.currentMonth ? (item.isToday ? 'swiper-item-today' : 'swiper-item-normal') : 'swiper-item-gray']" @click="itemClick(item)">
			<view style="display: flex; justify-content: center; align-items: center;" :class="{'swipt-item-bg' : (item.timeStr == day && item.currentMonth)}">
				<view>{{dayDisplay(item)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import calendar from './calendar.js'
	export default {
		name: 'CalendarView',
		props: {
			
			//默认选中的日期
			day: {
				type: String,
				default: ()=>{
					return calendar.currentDateStr(new Date())
				}
			},
			
			//当前月信息
			resData: {
				type: Object,
				default: () => {}
			},
			
			/*
				是否显示当月之外的日期
			*/
			displayOtherMonth: {
				type: Boolean,
				default: true
			}
		},

		created() {
			// console.log(this.resData)
		},
		
		methods: {
			
			dayDisplay(item){
				if(this.displayOtherMonth){
					return item.day
				}else{
					if(item.currentMonth){
						return item.day
					}else{
						return ''
					}
				}
			},
			
			itemClick(item){
				if(!this.displayOtherMonth){
					return
				}
				if(!item.currentMonth){
					if(item.prev){
						//上个月
						this.$emit('prev', calendar._getMomentPrev(this.resData.m))
					}else {
						//下个月
						this.$emit('next', calendar._getMomentNext(this.resData.m))
					}
				}
				this.$emit('update:selectDay', item.timeStr)
			}
		}
	}
</script>

<style scoped>
	.swiper-content {
		width: 100vw;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.swiper-item {
		width: calc(100vw/7);
		height: calc(100vw/7*0.8);
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: #007AFF;
		display: flex;
		font-size: 28upx;
	}

	.swiper-item-normal {
		color: #FFFFFF;
	}
	
	.swiper-item-gray {
		color: #999999;
	}

	.swiper-item-today {
		color: yellow;
	}
	
	.swipt-item-bg{
		background-color: #2C405A;
		width: 60upx;
		height: 60upx;
		border-radius: 30upx;
	}
</style>
