<template>
  
  <div style="width: 100%">
    <el-container style="width: 100%">

      <el-Aside v-if="!link_flag" width="200px">    

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
              @click = "open_ble_link(item)"
              >
                <p class="ellipsis " style="margin: 0px 0px 0px 0px; ">{{ item.name }}</p><p style="margin: 5px 0px 0px 0px; ">{{ item.mac }}</p>
              </el-card>
            </el-scrollbar>
        </el-row>
      </el-Aside>

      <el-Aside v-if="link_flag" width="200px">   

              <el-card class="ble-card-open "  shadow="always" 
              style="width: 99%; word-wrap: break-word; margin: 10px 10px 10px 0px; " 
              body-style="padding: 10px; " 
              >
                
                <el-row align='middle'>
                  <el-col :span="20">
                    <p class="ellipsis " style="margin: 0px 0px 0px 0px; ">{{ crr_open_ble_info.name }}</p>
                    <p style="margin: 5px 0px 0px 0px; ">{{ crr_open_ble_info.mac }}</p>
                  </el-col>
                  <el-col :span="4">

                    <el-button style="margin: 0px 0px 0px 0px;  " 
                   icon="SwitchButton" @click="close_ble_link"
                  type="danger" circle   > </el-button>
                  </el-col>
                </el-row>
              </el-card>

              <el-select class="ble-card-open-opt"
                v-model="baud_set"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="波特率-可直接输入"
              style="width: 90%;"
            >
              <el-option
                v-for="item in baud_set_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        
        <el-row>
          <el-switch
            v-model="send_true_code"
            active-text="将\n \r \a \b \t \v \f 以转义字符发送"
          />
        </el-row>
        </el-main>
    </el-container>
  </div>

</template>

<script setup>
import {watch,ref, onMounted,nextTick } from 'vue';
let baud_set = ref();
let baud_conf = 9600;
const baud_set_list = [
  {
    value: 9600,
    label: 9600,
  },
  {
    value: 115200,
    label: 115200,
  }
]
watch(baud_set,(newValue,OldValue) => {
  if(isNaN(newValue))
  {
      baud_set.value = baud_conf;
  }
  else
  {
    if(typeof(newValue.value) != 'number')
    {
      baud_conf = parseInt(newValue);
    }else
    {
      baud_conf = newValue;
    }
  }
      console.log(baud_conf);
      console.log(typeof(newValue));
 });




let crr_open_ble = null;
let crr_open_ble_service = null;
let data_send_h = null;
let data_read_h = null;



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




let crr_open_ble_info = null;
async function  refreshBle() {
  window.electron.ipcRenderer.send('message-open-ble-mac', '');
  crr_open_ble = await navigator.bluetooth.requestDevice( {acceptAllDevices: true,optionalServices:['000000ff-0000-1000-8000-00805f9b34fb']});
  link_flag.value = true;
  await crr_open_ble.gatt.connect();
  crr_open_ble_service = await crr_open_ble.gatt.getPrimaryService('000000ff-0000-1000-8000-00805f9b34fb');
  data_send_h = await crr_open_ble_service.getCharacteristic('0000ff01-0000-1000-8000-00805f9b34fb');
  if(!data_send_h)
  {
    link_flag.value = false;
  }
}
   
async function  open_ble_link(ble_mac) {
  crr_open_ble_info = ble_mac;
  window.electron.ipcRenderer.send('message-open-ble-mac', ble_mac.mac);

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

let send_true_code = ref(true);
let textarea=ref('');
async function  send_data() {
  if(data_send_h)
  {
    const encoder = new TextEncoder(); // 创建一个TextEncoder实例
    const uint8Array = encoder.encode(
      send_true_code.value?
      textarea.value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\a/g, '\a').replace(/\\b/g, '\b').replace(/\\t/g, '\t').replace(/\\v/g, '\v').replace(/\\f/g, '\f')
      :
      textarea.value
  ); 
    data_send_h.writeValue(uint8Array);
  }
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
@keyframes fadeInup {
    from {
    transform: translateY(50px);
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
    animation: fadeInup 1s ease-in-out forwards; /* 淡入效果，持续时间1秒，缓动函数，在动画结束时保持最后一帧的状态 */
}
 
.ble-card:hover {
  background: linear-gradient(102.7deg, rgb(253, 218, 255) 8.2%, rgb(223, 173, 252) 19.6%, rgb(173, 205, 252) 36.8%, rgb(173, 252, 244) 73.2%, rgb(202, 248, 208) 90.9%);
  cursor: pointer; /* 鼠标形状变为手指形状 */
}



.ble-card-open {
  background: linear-gradient(102.7deg, rgb(253, 218, 255) 8.2%, rgb(223, 173, 252) 19.6%, rgb(173, 205, 252) 36.8%, rgb(173, 252, 244) 73.2%, rgb(202, 248, 208) 90.9%);
  transition: background-color 0.3s; /* 平滑过渡效果 */
  color: #333;
    opacity: 0; /* 开始状态，透明度为0 */
    animation: fadeInup 0.5s ease-in-out forwards; /* 淡入效果，持续时间1秒，缓动函数，在动画结束时保持最后一帧的状态 */
}
 
.ble-card-open-opt {
    animation: fadeInup 0.5s ease-in-out forwards; /* 淡入效果，持续时间1秒，缓动函数，在动画结束时保持最后一帧的状态 */
}
</style>



