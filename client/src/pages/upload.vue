<template>
    <div style="margin-top: 60px">
        <el-tabs v-model="activeName">
            <el-tab-pane label="Select bucket" name="1">
                <div class="bucket">
                    <span style="margin-right: 20px">Select bucket</span>
                    <el-cascader 
                        v-model="oldBucket"
                        :options="state.dirTree" 
                        :props="{ checkStrictly: true }" 
                        clearable />
                </div>
            </el-tab-pane>
            <el-tab-pane label="New bucket" name="2">
                <el-input v-model="newBucket" placeholder="blog/yahaha" style="margin-bottom: 30px">
                    <template #prepend>eg: blog/yahaha</template>
                </el-input>
            </el-tab-pane>
        </el-tabs>
        <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :show-file-list='false'
            :on-change='upload'
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
        >
            <el-icon class="el-icon--upload">
                <upload-filled />
            </el-icon>
            <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                </div>
            </template>
        </el-upload>

        <div class="fileTree">
            <div>CDN文件tree</div> 
            <el-tree :data="state.fileTree" :props="{
                children: 'children',
                label: 'label',
            }"/>
        </div>
    </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
import { ref, reactive, unref, toRef, watch } from 'vue'
import axios from 'axios'

defineProps({
  msg: String
})

let activeName = ref('1')
let oldBucket = ref([])
let newBucket = ref('')
let bukectName = ref('')

const getBuckets = async function() {
    const { data } = await axios({
        method: 'get',
        url: 'http://localhost:7001/api/getBuckets',
    })

    state.dirTree = data.data.dirTree || []
    state.fileTree = data.data.fileTree || []
}

getBuckets()


let state = reactive({ 
    dirTree: [],
    fileTree: [],
})

watch(activeName, (tabName, prevValues) => {
    if(tabName === '1') {
        bukectName.value = oldBucket.value.join('/')
        newBucket.value = ''
    } else if(tabName === '2'){
        bukectName.value = newBucket.value
        oldBucket.value = []
    }
})
  
const checkBucket = () => {
    if(activeName.value === '1') {
        bukectName.value = oldBucket.value.join('/')
    } else if(activeName.value === '2'){
        bukectName.value = newBucket.value
    }

    console.log(bukectName.value)

    if(!bukectName.value) {
        ElMessage({
            message: 'bucket为空,请选择或者新建!!!',
            type: 'warning',
        })
        return false
    }

    return true
}

const upload = async function(file, fileList) {
    if(!checkBucket()) {
        return
    }
    let formData = new FormData()
    formData.append('file', file.raw)
    formData.append('bucket', bukectName.value)
    const { data } = await axios({
        method: 'post',
        url: 'http://localhost:7001/api/upload',
        data: formData
    })

    if(data.code === -1) {
        ElMessage({
            message: data.msg,
            type: 'error',
        })
    }else {
        ElMessage({
            message: data.msg,
            type: 'success',
        })
        getBuckets()
    }
    
}
</script>

<style>
.bucket {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.fileTree {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
}

.el-tree {
    min-width: 380px
}
</style>