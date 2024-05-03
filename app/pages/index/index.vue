<template>
	<!-- 主页面 -->
<view v-if="page_q == 'main'" >
	<view style="height: 39vh;">
		<u-row gutter="12" style="height: 30%;width: 100%;">
			<div   class="ble-card" style="height: 80px;font-size: 20px;width: 100%;margin: 10px 0px 10px 0px;">
			<u-row  v-if="!linkFlag" gutter="12" style="height: 80px;" >
				<u-col span="8">
					<p style="margin-left: 20px;">未连接</p> 
				</u-col>
				<u-col span="3">
				<u-button type="success" @click="open_ble_link">连接设备</u-button>
				</u-col>
			</u-row>
			<u-row  v-if="linkFlag" gutter="12" style="height: 80px;">
				<u-col span="8">
					<p style="margin-left: 20px; ">{{ble_deviceId}}</p>
				</u-col>
				<u-col span="3">
				<u-button type="error" @click="open_ble_link">断开连接</u-button>
				</u-col>
			</u-row>
			</div>
		</u-row>
		
		<u-row gutter="12" style="height: 70%;width: 100%;">
			<u-col   span="6" style="height: 100%;">
				<div   class="card" style="height: 100%;font-size: 18px;width: 100%;margin: 10px 0px 10px 0px;">
					<u-row   gutter="12" style="height: 20%;">
						<u-col span="9" offset="1">
						<p>服务器未连接</p>
						</u-col>
					</u-row>
					<u-row   gutter="12" tyle="height: 40%;">
						<u-col span="3">
						</u-col>
						<u-col span="6">
						<u-button type="success" style="margin-top : 20%;">连接服务器</u-button>
						</u-col>
						<u-col span="3">
						</u-col>
					</u-row>
					<u-row   gutter="12" style="height: 40%;">
						<u-col span="12">
							<u-subsection :list="data_net_line_list" :current="data_net_line"></u-subsection>
						</u-col>
					</u-row>
				</div>
			</u-col>
			<u-col   span="6" style="height: 100%;">
				<div   class="card" style="height: 100%;font-size: 18px;width: 100%;margin: 10px 0px 10px 0px;">

					<u-row   gutter="12" >
						<u-col span="4">
						</u-col>
						<u-col span="5">
						<u-button style="margin-top : 10px;" size="mini">刷新名单</u-button>
						</u-col>
						<u-col span="4">
						</u-col>
					</u-row>

				</div>
			</u-col>
		</u-row>
		
	</view>
		
	<view style="height: 55vh;margin-top: 20px" >
		<u-row gutter="12" style="margin-top : 10px;" aling="center">
			<u-col span="8">
			</u-col>
			<u-col span="1">
				<u-switch  style="margin-top: 7px" size=30 v-model="input_up"/>
			</u-col>
			<u-col span="3">
				<p>窗口滚动</p>
			</u-col>
		</u-row>
		
		<scroll-view  class="u-border u-m-10" 
		style="height: 70%;width: auto;white-space: pre-line;background-color: #f1f1f1;" 
		:scroll-top="scrollTop" 
		scroll-y="true"  
		show-scrollbar="true" >
		
			<div  ref="out_scrollbar_div">
				<p >{{in_text}}</p>
			</div>
		</scroll-view> 
		
		<u-row gutter="12">
			<u-col span="10">
				<textarea class="roundiup" style="height: 130rpx;width: 100%"
				v-model="send_text"  :border="true" />
			</u-col>
			<u-col span="2">
				<u-button style="height: 130rpx" @click="send_ble">发送</u-button>
			</u-col>
		</u-row>
		
	</view>

</view>

<!-- 搜索蓝牙 -->
<view v-else-if="page_q == 'ble_scr'">


		<u-row gutter="12">
			<u-col span="1">
				<u-icon name="arrow-left" @click="page_q = 'main';stop_f_ble();" ></u-icon>
			</u-col>
			<u-col span="1">
			</u-col>
			<u-col span="2">
				<u-button @click="open_f_ble" >搜索</u-button>
			</u-col>

			<u-col span="2">
				<u-button @click="stop_f_ble">停止</u-button>
			</u-col>
			<u-col span="2">
				<u-button @click="cl_list">清除</u-button>
			</u-col>
			<u-col span="2">
				<u-button @click="sasn_ble">扫码</u-button>
			</u-col>
		</u-row>
		
			<u-cell-item  @click="create_ble_link(item.deviceId)" :title="item.name" v-for="(item, index) in ble_list" :label="item.deviceId" :key="index" >
			</u-cell-item>
		<u-row gutter="16">
			<u-col span="16">
			</u-col>
		</u-row>
</view>
	
	
	
</template>

<script>
	    export default {
	        data() {
	            return {
					page_q:"main",//页面显示
					
					data_net_line_list: [
						{
							name: '关闭转发'
						}, 
						{
							name: '开启转发'
						}
					],
					data_net_line: 1,
					
					input_up:true,
					scrollTop: 0,
					in_text:'1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n1111\n',
					send_text:'2222',
					
					linkFlag:false,
					
						scr_flag: false,
						ble_list: [],
						ble_deviceId:null,
	            }
	        },
	        methods: {
				open_ble_link(){
					this.page_q = 'ble_scr';
					console.log("1");
				},
				to_out_botton(){
					this.scrollTop = this.$refs.out_scrollbar_div.clientHeight;
				},
				
				//开始搜索蓝牙
				open_f_ble(){
					this.ble_list = [];
					uni.openBluetoothAdapter({
					  success(res) {
					    console.log(res)
					  }
					})
					uni.startBluetoothDevicesDiscovery({
					  success(res) {
					    console.log(res)
					  }
					})
					this.scr_flag = true;
					uni.onBluetoothDeviceFound((ble_dev) => {
						if(ble_dev.devices[0].name != "")
						if(this.ble_list.includes(ble_dev.devices[0])!=true)
						{
							this.ble_list.push(ble_dev.devices[0]);
						}
						console.log(ble_dev.devices[0]);
					})
				}, 
				//停止搜索蓝牙
				stop_f_ble(){
					uni.stopBluetoothDevicesDiscovery({
					  success(res) {
						  
					    console.log(res)
					  }
					})
						  this.scr_flag = false;
				}, 
				//清空搜索列表
				cl_list(){
					this.ble_list.splice(0)
				}, 
				//扫码
				sasn_ble(){
					uni.scanCode({
						onlyFromCamera: true,
						success: (res)=> {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							this.$u.toast('扫码内容：' + res.result)
						}
					});
				}, 
				//连接设备
				create_ble_link(ble_deviceId){
					this.stop_f_ble();
					uni.createBLEConnection({
					  deviceId: ble_deviceId,
					  success: (res)=> {
						this.page_q = 'main';
						this.ble_deviceId = ble_deviceId;
						this.linkFlag = true;
						// uni.onBLEConnectionStateChange((res) => {
						//   // 该方法回调中可以用于处理连接意外断开等异常情况
						// 	this.ble_deviceId = null;
						// 	this.linkFlag = false;
						// })
						setTimeout(() => {
							//this.get_ble();
							uni.onBLECharacteristicValueChange((res) => {
							   console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
							   console.log(res.value);
							})
							uni.notifyBLECharacteristicValueChange({
							  state: true, // 启用 notify 功能
							  deviceId: this.ble_deviceId,
							  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
							  characteristicId: '0000ff01-0000-1000-8000-00805f9b34fb',
							  success(res) {
								console.log('notifyBLECharacteristicValueChange success', res.errMsg)
							  },
							  fail(res) {
								console.log('notifyBLECharacteristicValueChange fail', res.errMsg)
							  }
							});
							uni.notifyBLECharacteristicValueChange({
							  state: true, // 启用 notify 功能
							  deviceId: this.ble_deviceId,
							  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
							  characteristicId: '0000ff03-0000-1000-8000-00805f9b34fb',
							  success(res) {
								console.log('notifyBLECharacteristicValueChange success', res.errMsg)
							  },
							  fail(res) {
								console.log('notifyBLECharacteristicValueChange fail', res.errMsg)
							  }
							});
							
							console.log('蓝牙设备连接成功');
							}, 1500 );
					  }
					})
				},
				//获得特征值
				get_ble(){
					uni.getBLEDeviceServices({ deviceId: this.ble_deviceId }).then(res => {
					  console.log('蓝牙设备服务列表：', res.services);
					  uni.getBLEDeviceCharacteristics({ deviceId: this.ble_deviceId, serviceId: '000000ff-0000-1000-8000-00805f9b34fb' }).then(res => {
					    console.log('蓝牙设备特征值列表：', res.characteristics);
					  }).catch(err => {
					    console.log('获取蓝牙设备特征值列表失败：', err);
					  });
					}).catch(err => {
					  console.log('获取蓝牙设备服务列表失败：', err);
					});
				},
				//发送消息
				send_ble(){
					let u8_buffer = [30];
					this.ble_mosi(0,u8_buffer);
				},
				//发送蓝牙命令/数据
				//type==0为数据否则为命令通道
				//arr ArrayBuffer
				ble_mosi(type,arr){
					if(!this.linkFlag)
					{
						return;
					}
					if(type == 0)
					{
						uni.writeBLECharacteristicValue({
						  deviceId: this.ble_deviceId,
						  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
						  characteristicId: '0000ff02-0000-1000-8000-00805f9b34fb',
						  value: arr,
						  success: function (res) {
							console.log('数据写入成功')
						  }
						})
					}
					else if(type == 1)
					{
						uni.writeBLECharacteristicValue({
						  deviceId: this.ble_deviceId,
						  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
						  characteristicId: '0000ff04-0000-1000-8000-00805f9b34fb',
						  value: arr,
						  success: function (res) {
							console.log('命令写入成功')
						  }
						})
					}
				},
				ble_miso(ble_data){
					if(!this.linkFlag)
					{
						return;
					}
					if(type == 0)
					{
						uni.writeBLECharacteristicValue({
						  deviceId: this.ble_deviceId,
						  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
						  characteristicId: '0000ff02-0000-1000-8000-00805f9b34fb',
						  value: arr,
						  success: function (res) {
							console.log('数据写入成功')
						  }
						})
					}
					else if(type == 1)
					{
						uni.writeBLECharacteristicValue({
						  deviceId: this.ble_deviceId,
						  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
						  characteristicId: '0000ff04-0000-1000-8000-00805f9b34fb',
						  value: arr,
						  success: function (res) {
							console.log('命令写入成功')
						  }
						})
					}
				},
	        }
	    }
</script>

<style>

.ble-card{
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background: linear-gradient(102.7deg, rgb(253, 218, 255) 8.2%, rgb(223, 173, 252) 19.6%, rgb(173, 205, 252) 36.8%, rgb(173, 252, 244) 73.2%, rgb(202, 248, 208) 90.9%);
  border-radius: 20px;

}
.card{
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 20px;

}

.roundiup {
  border: 1px solid #d3d3d3;
  border-radius: 5px;
}
</style>
