<template>
	<view>


		<u-row gutter="16">
			<u-col span="3">
				<u-button @click="open_f_ble" >搜索</u-button>
			</u-col>

			<u-col span="3">
				<u-button @click="stop_f_ble">停止</u-button>
			</u-col>
			<u-col span="3">
				<u-button @click="cl_list">清除</u-button>
			</u-col>
			<u-col span="3">
				<u-button @click="sasn_ble">扫码连接</u-button>
			</u-col>
			<u-col span="3">
				<u-button @click="get_ble">获取信息</u-button>
			</u-col>
			<u-col span="3">
				<u-button @click="send_ble">发送数据</u-button>
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
  var buffer = new ArrayBuffer(16); // 创建一个3字节的ArrayBuffer
  var u8_buffer = new Uint8Array(buffer,0);
	export default {
		data() {
			return {
				scr_flag: false,
				ble_list: [],
				ble_deviceId:null,
			}
		},
		onLoad() {

		},
		methods: {
			open_f_ble(){
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
			stop_f_ble(){
				uni.stopBluetoothDevicesDiscovery({
				  success(res) {
					  
				    console.log(res)
				  }
				})
					  this.scr_flag = false;
			}, 
			cl_list(){
				this.ble_list.splice(0)
			}, 
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
			create_ble_link(ble_deviceId){
				uni.createBLEConnection({
				  deviceId: ble_deviceId,
				  success: (res)=> {
					this.ble_deviceId = ble_deviceId;
				    console.log('蓝牙设备连接成功')
				  }
				})
			},
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
			send_ble(){
				u8_buffer[0] = 30;
				uni.writeBLECharacteristicValue({
				  deviceId: this.ble_deviceId,
				  serviceId: '000000ff-0000-1000-8000-00805f9b34fb',
				  characteristicId: '0000ff01-0000-1000-8000-00805f9b34fb',
				  value: buffer,
				  success: function (res) {
					console.log('数据写入成功')
				  }
				})
			}
			
			
		}
	}
</script>

<style>

</style>
