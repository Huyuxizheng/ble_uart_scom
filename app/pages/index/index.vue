<template>
	<view>
			<view>
				<scroll-view style="overflow: scroll;overflow-y: scroll;" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" 
				show-scrollbar="true" >
					<view id="demo1" class="scroll-view-item uni-bg-red">A</view>
					<view id="demo2" class="scroll-view-item uni-bg-green">B</view>
					<view id="demo3" class="scroll-view-item uni-bg-blue">C</view>
				</scroll-view> 
			</view>
	<!-- <u-input style="overflow: scroll;overflow-y: scroll;" v-model="in_text" type="textarea" :border="true" :auto-height="false" :disabled="true"/>
	 -->
				<view class="uni-textarea">
					<textarea placeholder-style="color:#F76260" placeholder="占位符字体是红色的"/>
				</view>
		<u-row gutter="16">

			<u-col span="3">
				<u-button @click="open_ble_link">连接设备</u-button>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	    export default {
	        data() {
	            return {
					scrollTop: 0,
					in_text:'1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n \
					1111111111111111\n ',
	            }
	        },
	        mounted() {
	        },
	        methods: {
				open_ble_link(){
					
					uni.navigateTo({
						url: "../ble_link/ble_link"
					});
					console.log("1");
				},
	        
	        }
	    }
</script>

<style>
scroll-view ::v-deep ::-webkit-scrollbar {
		    display: unset; 
		    width: unset; 
		    height: unset; 
		    -webkit-appearance: unset; 
		    background: unset;
	}
	.scroll-Y {
		height: 300rpx;
	}
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}
	.scroll-view-item_H {
		display: inline-block;
		width: 100%;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}
</style>
