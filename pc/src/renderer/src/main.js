import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import * as Icons from '@element-plus/icons-vue';  

const app = createApp(App);
// 注册所有图标  
Object.keys(Icons).forEach(key => {  
    app.component(key, Icons[key]);  
  });

app.use(ElementPlus).mount('#app');
//createApp(App).mount('#app')
