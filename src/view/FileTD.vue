<template>
  <el-container>
    <el-main>
   <el-upload
    class="upload-demo"
    drag
    action="http://192.168.100.32:8095/upload"
    multiple
    :on-success="onSuccess"
    :show-file-list="false"
    :on-process="onProcess"
    :on-error="onError"
    :on-exceed="onExceed"
    accept="/"
    >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">点击/拖拽上传</div>
  </el-upload>
  <br>
  <el-table :data="tableData" style="width: 100%" max-height="190" stripe="true">
    <el-table-column prop="fileName" label="FileName" width="400" />
    <el-table-column prop="filePath" label="FilePath" width="550" />
    <el-table-column label="Operation" width="200">
      <template #default="scope">
        <el-button
          size="small"
          type="success"
          @click="handleDownload(scope.row)"
          circle 
          :icon="Download"
          ></el-button>

          <el-popconfirm
              confirm-button-text="Yes"
              cancel-button-text="No"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="delete this?"
              hide-after="50"
              @confirm="handleDelete(scope.row)"
            >
            <template #reference>
              <el-button size="small" type="danger" circle :icon="Delete"></el-button>
            </template>
          </el-popconfirm>
      </template>
  </el-table-column>
  </el-table>
</el-main>
  <el-footer> 
    <el-row>
    <el-col :span="23">
      <el-input v-model="input" placeholder="请输入内容" autosize type="textarea"></el-input>
    </el-col>
    <el-col :span="1">
      <el-button type="primary" round @click="sendMessage" :icon="Promotion" color="#705697"></el-button>
    </el-col>
  </el-row>
  <el-input v-model="text" :rows="6" type="textarea" readonly="true" class="text"></el-input>

  </el-footer>
  </el-container>
</template>
      


      <script setup>
      import axios from 'axios';
      import { h, ref } from 'vue'
      import { UploadFilled } from '@element-plus/icons-vue'
      import {Check,Delete,Edit,Message,Search,Star,Download,Promotion} from '@element-plus/icons-vue'
      import { socketIp, uname } from '../../config.js'
      import { ElMessage,ElNotification } from 'element-plus'
      import {serverIp} from '../../config.js'



      const tableData = ref([])
      const input = ref('')
      const text = ref('')

      const socket = new WebSocket('ws://192.168.100.31:8080/websocket/'+uname.value);
      socket.onopen = function(event) {
        console.log('WebSocket连接已建立');

        showAllMessage();

      };
  // 当收到服务器消息时触发
      socket.onmessage = function(event) {
          console.log('收到服务器消息：', event.data);
          // 更新消息列表
          text.value += event.data+'\n';
      };
      socket.onclose = function(event) {
          console.log('WebSocket连接已关闭');
      };

      socket.onerror = function(event) {
          console.log('WebSocket发生了错误');
      };
    
    
      
//获取所有文件     
      const showAll =async ()=>{
        const response2 = await axios.get(serverIp+'/showAll');
                response2.data.forEach(element => {
                        console.log(element.fileName+element.filePath);
                })
                tableData.value = response2.data
        
      }
      

//文件上传的事件
      const onSuccess =async ()=>{
        ElMessage.success('上传成功!');
        showAll();
      }
      const onProcess =async ()=>{
        ElMessage.success('文件传输中...');
      }
      const onError =async ()=>{
        ElMessage.error('文件传输失败!');
      }
      const onExceed =async ()=>{
        ElMessage.error('文件过大或数量超出限制!');
      }




//下载和删除文件
      const handleDownload =async (row)=>{
        try {
        const response = await axios.get(serverIp+'/download', {
            params: {
                filepath: row.filePath
            },
        });
        console.log('aaaaa++'+response.data);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log('bbbb'+url);
      // 创建一个链接元素
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', row.fileName);  // 设置下载文件的名称
        // 触发点击链接操作
        link.click();
      } catch (error) {
        console.log('下载文件时出现错误：', error);
      }
      }
      const handleDelete =async (row)=>{
            try {
            const response = await axios.get(serverIp+'/delete', {
                params: {
                    fileName: row.fileName
                },
            });
            ElMessage.success(response.data);
            showAll();
          } catch (error) {
            ElMessage.error('删除文件时出现错误：', error);
          }
      }

//发送按钮点击事件
      const sendMessage =async ()=>{
        if(uname.value==''){
          ElNotification({
            title: '提示',
            message: '使用该功能需要先<a href="/login">登录</a>',
            type: 'warning',
            dangerouslyUseHTMLString: true
          })
          return
        }
        if(input.value==''){
          ElMessage.warning('发送内容不能为空')
          return
        }
        socket.send(input.value);  
        input.value='';   
      }


//获取所有聊天记录
      const showAllMessage =async ()=>{

        const response = await axios.get(socketIp+'/getAllMessage');
                text.value='';
            response.data.forEach(element => {
                text.value+=element.name+' :    '+element.message+'\n';
            })

      }

      showAll();
      </script>
      
      <style>
      .text{
        color: purple; /* 设置文字颜色为紫色 */
        font-family: 'Arial'; /* 设置字体样式 */
        font-size: 13px; /* 设置字体大小 */
        line-height: 1.5; /* 设置行高 */

      }
      </style>