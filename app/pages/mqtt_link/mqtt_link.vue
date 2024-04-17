<template>
		<u-row gutter="16">
			<u-col span="3">
				<u-button @click="connect">连接MQTT</u-button>
			</u-col>
		</u-row>
</template>

<script>
    import { v4 } from 'uuid';
    import {
        MQTT_IP,
        MQTT_OPTIONS
    } from '@/utils/mqtt.js';
    var mqtt = require('mqtt/dist/mqtt.js')
    var client
    export default {
        data() {
            return {
                topic: 'testtopic/yu1' //要订阅的主题
            }
        },
        mounted() {//this.connect() //连接
        },
        methods: {
			open_ble_link(){
				
				uni.navigateTo({
					url: "../ble_link/ble_link"
				});
				console.log("1");
			},
            connect() {
				console.log("1");
                MQTT_OPTIONS.clientId = v4()
                var that = this
                
                client = mqtt.connect('wss://' + MQTT_IP, MQTT_OPTIONS)
                
                client.on('connect', function() {
                    console.log('连接成功')
                    client.subscribe(that.topic, function(err) {
                        if (!err) {
                            console.log('订阅成功')
                        }
                    })
                }).on('reconnect', function(error) {
                    console.log('正在重连...', that.topic)
                }).on('error', function(error) {
                    console.log('连接失败...', error)
                }).on('end', function() {
                    console.log('连接断开')
                }).on('message', function(topic, message) {
                    console.log('接收推送信息：', message.toString())
                })
            }
        }
    }
</script>

<style>
</style>