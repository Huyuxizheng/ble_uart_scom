<template>
	<view>

	<scroll-view  class="u-border u-m-10" 
	style="height: 70vh;width: auto;white-space: pre-line;background-color: #f1f1f1;" 
	:scroll-top="scrollTop" 
	scroll-y="true"  
	show-scrollbar="true" >
	
		<div  ref="out_scrollbar_div">
			<p >{{in_text}}</p>
		</div>
	</scroll-view> 



		<u-row gutter="16">
			<u-col span="3">
				<u-button @click="open_ble_link">连接设备</u-button>
			</u-col>
			<u-col span="3">
				<u-button @click="to_out_botton">发送</u-button>
			</u-col>
			<u-col span="1">
			</u-col>
			<u-col span="2">
				<u-switch v-model="input_up"/>
			</u-col>
			<u-col span="3">
				<p >窗口滚动</p>
			</u-col>
		</u-row>
		
		
		<u-input style="height: 150rpx;width: auto;"
		v-model="send_text" type="textarea" :border="true" />

	</view>
</template>

<script>
	    export default {
	        data() {
	            return {
					input_up:true,
					scrollTop: 0,
					in_text:'1111',
					send_text:'2222',
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
				to_out_botton(){
					this.scrollTop = this.$refs.out_scrollbar_div.clientHeight;
				}
	        
	        }
	    }
</script>

<style>


</style>
