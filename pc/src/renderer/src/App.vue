<template>
  
  <div style="width: 100%">
    <el-container style="width: 100%">

      <el-Aside width="200px" style="overflow: hidden;">   
        <div v-if="!link_flag">
          <el-tabs type="card"  class="link-tabs">
          <el-tab-pane label="蓝牙连接"> 
          <el-row style="height: 40px; ">
            <el-space wrap :size="0">

              <!-- 开始、停止搜索 -->
              <el-button-group>
                <el-button style="width: 40px" icon="Refresh"  @click="refreshBle" />
                <!-- <el-button style="width: 40px" icon="Link" @click="open_ble_link"/> -->
              </el-button-group>
                <el-input v-model="ble_namePrefix" style="width: 160px" placeholder="过滤蓝牙名" />

              
            </el-space>
          </el-row>

          <el-row v-if="bleNamelist_temp.length !== 0" style="width: 100%;" >
              <!-- 蓝牙列表 --> 
              <el-scrollbar   style="width: 100%;" height = "calc(100vh - 90px)" always>
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

          <el-row v-if="bleNamelist_temp.length === 0" style="width: 100%;" >
            <el-empty style="margin-left: 30px; " :image-size="100" description="点击刷新搜索蓝牙设备" />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="网络连接">Config</el-tab-pane>
  </el-tabs>
      </div>
      <div v-if="link_flag"> 

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
                   icon="CloseBold" @click="close_ble_link"
                  type="danger" circle   :loading="link_ing_flag" :disabled="link_ing_flag"> </el-button>
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
            <el-text style="margin-left: 38px;" size="small">  波特率可直接输入</el-text>
            
              <el-option
                v-for="item in baud_set_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

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

        
        <el-row  align='middle'>
          <el-col :span="3">
            <el-switch
              inline-prompt
              v-model="send_out_type"
              active-text="hex发送" active-value = 'hex'
              inactive-text="str发送" inactive-value = 'str'
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-col>
          
          <el-col :span="5">
              <el-select
              v-model="dis_type"
              placeholder="显示方式"
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="item in dis_type_opt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          
        </el-row>
          
        <!-- 16进制发送 -->
        <div v-if="send_out_type == 'hex'">
        <el-row>
          <el-input
            v-model="textarea_hex"
            style="width: 90%;"
            :rows=4
            type="textarea"
            placeholder="直接输入十六进制自动格式化"
            :validate-event=false
            resize='none'
          />
              <el-button style="width: 10%" @click="send_data_hex"> send </el-button>
        </el-row>
        
      </div>

          <!-- 字符串发送 -->
        <div v-if="send_out_type == 'str'">
        <el-row>
          <el-input
            v-model="textarea_str"
            style="width: 90%;"
            :rows=4
            type="textarea"
            placeholder="输入字符串"
            :validate-event=false
            resize='none'
          />
              <el-button style="width: 10%" @click="send_data_str"> send </el-button>
        </el-row>
        
        <el-row>
          <el-switch
            v-model="send_true_code"
            active-text="将\n \r \a \b \t \v \f 以转义字符发送"
          />
        </el-row>
      </div>

        </el-main>
    </el-container>
  </div>

</template>

<script setup>
import {watch,ref, onMounted,nextTick } from 'vue';
import { ElNotification } from 'element-plus';
import iconv from  'iconv-lite';
let baud_set = ref();
let send_out_type = ref('str');
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
      let arr = [0x01]
      arr.push((baud_conf>>0) & 0xff);
      arr.push((baud_conf>>8) & 0xff);
      arr.push((baud_conf>>16) & 0xff);
      arr.push((baud_conf>>24) & 0xff);
      cmd_send(arr);
 });




let crr_open_ble = null;
let data_send_h = null;
let data_read_h = null;
let cmd_send_h = null;
let cmd_read_h = null;



let link_flag=ref(false);
let link_ing_flag=ref(false);
let dis_type=ref('GBK');
const dis_type_opt = [
  {
    value: 'hex', label: '以十六进制显示'
  },
  {
    value: 'GBK', label: '以字符串显示-GBK编码'
  },
  {
    value: 'utf-8', label: '以字符串显示-utf-8编码'
  }
]


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


let ble_namePrefix=ref();
watch(ble_namePrefix,(newValue,OldValue) => {
  refreshBle();
 });

let crr_open_ble_info = null;
async function  refreshBle() {
  window.electron.ipcRenderer.send('message-open-ble-mac', '');
  if(ble_namePrefix.value)
  {
    crr_open_ble = await navigator.bluetooth.requestDevice( {filters: [ {namePrefix: ble_namePrefix.value} ],
    optionalServices:['000000ff-0000-1000-8000-00805f9b34fb']});
  }
  else
  {
    crr_open_ble = await navigator.bluetooth.requestDevice( {acceptAllDevices: true,
    optionalServices:['000000ff-0000-1000-8000-00805f9b34fb']});

  }
  
  link_flag.value = true;
  link_ing_flag.value = true;
    try {
      crr_open_ble.addEventListener('gattserverdisconnected', onDisconnected);
      await crr_open_ble.gatt.connect();
      const service = await crr_open_ble.gatt.getPrimaryService('000000ff-0000-1000-8000-00805f9b34fb');
      data_send_h = await service.getCharacteristic('0000ff02-0000-1000-8000-00805f9b34fb');
      data_read_h = await service.getCharacteristic('0000ff01-0000-1000-8000-00805f9b34fb');
      data_read_h.startNotifications();
      data_read_h.addEventListener('characteristicvaluechanged',
      text_out);

      cmd_send_h = await service.getCharacteristic('0000ff04-0000-1000-8000-00805f9b34fb');
      cmd_read_h = await service.getCharacteristic('0000ff03-0000-1000-8000-00805f9b34fb');
      cmd_read_h.startNotifications();
      cmd_read_h.addEventListener('characteristicvaluechanged',
      cmd_read_cb);

      ElNotification({
       message: '蓝牙已连接',
       type: 'info',
      })
   }catch (error) {
    ElNotification({
      message: '蓝牙连接失败',
      type: 'info',
    })
    close_ble_link();
    ble_list = [];
    bleNamelist_temp.value = [];
    link_flag.value = false;
    crr_open_ble = null;
    data_send_h = null;
  }
  
  link_ing_flag.value = false;
}

//关闭蓝牙连接
async function  close_ble_link() {
  crr_open_ble.gatt.disconnect();
}


//监听蓝牙断开
function onDisconnected(event) {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);

  ElNotification({
    message: '蓝牙已断开',
    type: 'info',
  })
  ble_list = [];
  bleNamelist_temp.value = [];
  link_flag.value = false;
  crr_open_ble = null;
  data_send_h = null;

}

//选择设备
async function  open_ble_link(ble_mac) {
  crr_open_ble_info = ble_mac;
  window.electron.ipcRenderer.send('message-open-ble-mac', ble_mac.mac);

 }

 //接收命令端回复
 function  cmd_read_cb(event) {
      const value = new Uint8Array(event.target.value.buffer);
      if(value[0] == 0)
        {
          const encoder = new TextDecoder('utf-8');
          const mag_text = encoder.decode(value.subarray(1));
          
          ElNotification({
            message: mag_text,
            type: 'success',
          })  
        }

 }
 function  cmd_send(byteArray)
 {
    if(cmd_send_h)
    {
      const uint8Array = new Uint8Array(byteArray);
      cmd_send_h.writeValue(uint8Array);
    }
 }




 //接收数据显示到窗口
let msg=ref([]);
const out_scrollbar = ref();
const out_scrollbar_div = ref();
function  text_out(event) {
      const value = new Uint8Array(event.target.value.buffer);
      console.log(value);
      let out_text = null;

        if(dis_type.value == 'GBK')
        {
          const encoder = new TextDecoder('GBK');
          const text_gbk = encoder.decode(value);//增加结束符
          const buf = iconv.encode(text_gbk,'GBK');
          out_text = iconv.decode(buf,'utf-8');
        }
        else if(dis_type.value == 'utf-8')
        {
          const encoder = new TextDecoder('utf-8');
          out_text = encoder.decode(value);//增加结束符
        }
        else{
          out_text = '';
          for(let i = 0; i < value.length; i++) {
            let hex = value[i].toString(16);
            // 补零确保单字节的十六进制数字是两位数
            hex = ('00' + hex).slice(-2);
            out_text += hex+' ';
          }
        } 

      let currentdate = new Date();
      msg.value.push('['+currentdate.toLocaleString()+':'+currentdate.getMilliseconds().toString().padStart(3, '0')+'] '+out_text);
      nextTick(() => {out_scrollbar.value.setScrollTop(out_scrollbar_div.value.clientHeight);})
}

//发送字符串数据
let send_true_code = ref(true);
let textarea_str=ref('');
async function  send_data_str() {
  if(data_send_h)
  {
    const encoder = new TextEncoder('GBK'); // 创建一个TextEncoder实例
    const uint8Array = encoder.encode(
      send_true_code.value?
      textarea_str.value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\a/g, '\a').replace(/\\b/g, '\b').replace(/\\t/g, '\t').replace(/\\v/g, '\v').replace(/\\f/g, '\f')
      :
      textarea_str.value
  ); 
    data_send_h.writeValue(uint8Array);
      console.log(uint8Array);
  }
}

//发送十六进制
let textarea_hex=ref('');
watch(textarea_hex,(newValue,OldValue) => {

  if(newValue == OldValue)
  {
    return;
  }

  if(newValue.length)
  if(
    (newValue.length%3==0 && newValue[newValue.length-1]==' ')||
    ( /^[0-9A-Fa-f\s]+$/.test(newValue) ) 
  )
  {
    textarea_hex.value = newValue.replace(/\s+/g, '').replace(/(.{2})(?=.)/g, '$1 ');
  }
  else 
  {
    textarea_hex.value = OldValue.replace(/\s+/g, '').replace(/(.{2})(?=.)/g, '$1 ');
  }

 });
 function  hexToByteArray(hex) {
    const byteArray = [];
    for (let i = 0; i < hex.length; i += 3) {
      byteArray.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(byteArray);
  };
async function  send_data_hex() {
  if(data_send_h)
  {
    const uint8Array = hexToByteArray(textarea_hex.value)
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
.link-tabs {
  --el-tabs-header-height:35px !important;

}
.link-tabs > .el-tabs__header {
  margin: 0px 0px 5px 0px; 
}
</style>



