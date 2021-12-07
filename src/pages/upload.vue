<template>
    <div>
        <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change='upload'
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                </div>
            </template>
        </el-upload>
    </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons'
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)

const upload = function(e) {
    console.log(e)
}
</script>