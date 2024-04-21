<template>
  
  <div style="width: 100%">
    <el-container style="width: 100%">

      <el-Aside width="200px">    

        <el-row style="height: 40px">
          <el-space wrap :size="0">

            <!-- 开始、停止搜索 -->
            <el-button-group v-if="!link_flag">
              <el-button style="width: 40px" icon="Refresh"  @click="refreshBle" />
              <!-- <el-button style="width: 40px" icon="Link" @click="open_ble_link"/> -->
            </el-button-group>

            <!-- 断开连接
            <el-button-group v-if="link_flag">
              <el-button style="width: 80px" type="success" icon="SwitchButton" @click="close_ble_link">  </el-button>
            </el-button-group> -->
          </el-space>
        </el-row>

        <el-row style="width: 100%;" >
            <!-- 蓝牙列表 --> 
            <el-scrollbar   style="width: 100%;" height = "calc(100vh - 50px)" always>
              <el-card class="ble-card "  shadow="hover" 
              style="width: 90%; word-wrap: break-word; margin: 10px 10px 10px 0px; " 
              body-style="padding: 10px; " 
              v-for="item in bleNamelist_temp" 
              @click = "open_ble_link(item.mac)"
              >
                <p class="ellipsis " style="margin: 0px 0px 0px 0px; ">{{ item.name }}</p><p style="margin: 5px 0px 0px 0px; ">{{ item.mac }}</p>
              </el-card>
            </el-scrollbar>
        </el-row>
      </el-Aside>

        <el-main style="width: 100%;padding-top:0;height:100dvh">
      <el-row style="width: 100%;">
          <el-card style="width: 100%;height:99%" shadow="always" >
            <el-scrollbar ref="out_scrollbar" style="width: auto;height:99%" height = "calc(100vh - 220px)" always>
              <div ref="out_scrollbar_div">
                <p style="width: calc(100% - 30px); word-wrap: break-word " v-for="item in msg" >{{ item }}</p>
              </div>
            </el-scrollbar>
          </el-card>
        </el-row>
        <el-row>
          
          <el-input
            v-model="textarea"
            style="width: 90%;"
            :rows=4
            type="textarea"
            placeholder="Please input"
            :validate-event=false
            resize='none'
          />
              <el-button style="width: 10%" @click="send_data"> send </el-button>
        </el-row>
        </el-main>
    </el-container>
  </div>

</template>

<script setup>
import {ref, onMounted,nextTick } from 'vue';
import { ElMessage } from 'element-plus'

let crr_open_ble = null;



let link_flag=ref(false);
let _reader=null;



//初始化
let ble_list= [];
let bleNamelist_temp=ref([]);
onMounted(() =>{
  window.electron.ipcRenderer.on("reader-ble-dev-list", (event, value) => {
    console.log(value);
    ble_list = [];
    ble_list = value;
    bleNamelist_temp.value = [];
    for (let item of ble_list) { // 使用for...of正确遍历数组元素
      bleNamelist_temp.value.push({name : item.deviceName,mac: item.deviceId}); // 处理每个元素...
    }
 });
});




async function  refreshBle() {
  window.electron.ipcRenderer.send('message-open-ble-mac', '');
    await navigator.bluetooth.requestDevice( {acceptAllDevices: true});
}
   
async function  open_ble_link(ble_mac) {
 
  window.electron.ipcRenderer.send('message-open-ble-mac', ble_mac);

 }

 
let msg=ref([]);
//  const out_scrollbar = ref();
// const out_scrollbar_div = ref();
//  async function  monitor() {
//    var e;
//    const textDecoder = new TextDecoder();
//    const t = port.readable.getReader();
//    _reader = t;
//    let currentTime ,lastTime = 0;
//    let currentdate;
//          currentdate = new Date();
//          currentTime = currentdate.getTime();
//          if(!lastTime){lastTime = currentTime;msg.value.push('['+currentdate.toLocaleString()+':'+currentdate.getMilliseconds().toString().padStart(3, '0')+'] '+o);}
//          else{
//            if((currentTime-lastTime)<50)
//            {
//              msg.value[msg.value.length - 1] += o;
//            }
//            else
//            {
//              msg.value.push('['+currentdate.toLocaleString()+':'+currentdate.getMilliseconds().toString().padStart(3, '0')+'] '+o);
//            }
//            lastTime = currentTime;
//          }
//          nextTick(() => {out_scrollbar.value.setScrollTop(out_scrollbar_div.value.clientHeight);})

// }

async function  close_ble_link() {

}


let textarea=ref('');
async function  send_data() {
 const encoder = new TextEncoder(); // 创建一个TextEncoder实例
 const uint8Array = encoder.encode(textarea.value); 

}



</script>

<style>
body {
  overflow: hidden;
}
.ellipsis {
  white-space: nowrap; /* 确保文本在一行内显示 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
}

/* 定义关键帧 */
@keyframes fadeIn {
    from {
    transform: translateY(100%);
        opacity: 0;
    }
    to {
    transform: translateY(0);
        opacity: 1;
    }
}
 
.ble-card {
  background-color: #ffffff; /* 默认背景颜色 */
  transition: background-color 0.3s; /* 平滑过渡效果 */
  color: #333;
    opacity: 0; /* 开始状态，透明度为0 */
    animation: fadeIn 1s ease-in-out forwards; /* 淡入效果，持续时间1秒，缓动函数，在动画结束时保持最后一帧的状态 */
}
 
.ble-card:hover {
  background-color: #c4fac4; /* 鼠标经过时的背景颜色 */
  cursor: pointer; /* 鼠标形状变为手指形状 */
}
</style>



