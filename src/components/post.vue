<template>
    <div class="pic-box">
        <img src="@/assets/face.png" alt="" class="face-img">
        <video playsinline id="video" autoplay="true" muted v-show="showCamera"></video>
        <canvas id="canvas" v-show="!showCamera"></canvas>
        <img v-if="!showCamera && generatedImg" :src="generatedImg" alt="" class="generated-img">
    </div>
    <div class="btn-box">
        <img v-if="showCamera" src="@/assets/photo.png" alt="" class="photo-img" @click="takePhoto">
        <div v-else class="icon-box">
            <img src="@/assets/cancel.png" alt="" class="photo-img" @click="handleCancel">
            <img src="@/assets/confirm.png" alt="" class="photo-img" @click="handleConfirm">
        </div>
    </div>
</template>
<script setup >
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { showToast } from 'vant';

const showCamera = ref(true);
const generatedImg = ref('');

const fontSize = window.innerWidth / 10;//这里的fontSize是根字体大小
// 这里使用了rem单位 算出fontSize之后手动算出相机的尺寸大小（7.78666的值为：ui设计盒子宽度/37.5） 因为我的ui设计稿宽度是375px
// 因为初始化相机时需要指定相机的分辨率 计算出相机宽高后 在乘以dpi 可以解决照片模糊问题
const videoWidth = Math.floor(fontSize * 7.78666);
const videoHeight = Math.floor(fontSize * 7.78666);

//开启摄像头
const getMedia = async () => {
    try {
        const devicePixelRatio = window.devicePixelRatio || 1;//获取此设备dpi
        const constraints = {
            // video配置，具体配置可以看看mdn  这里指定分辨率
            video: {
                height: videoWidth * devicePixelRatio,
                width: videoHeight * devicePixelRatio,
                // user 前置摄像头 environment 后置摄像头
                facingMode: { exact: 'user' }
            },
            audio: false
        }
        let video = document.getElementById('video');
        video.onloadstart = function () { };
        video.onloadedmetadata = function () {
            video.play();
        };
        video.onloadeddata = function () { };
        if (navigator.mediaDevices) {
            window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.srcObject = stream;
            }).catch(function (error) {
                console.log(error);
                if (error.name == 'NotAllowedError') {
                    // 用户拒绝
                    showToast('拒绝开启摄像头');
                };
            })
        } else {
            showToast('浏览器不支持');
        }
    } catch (error) {
        console.log(error);
    }
};
// 重新拍照
const handleCancel = () => {
    showCamera.value = true;
};
// 确定
const handleConfirm = () => {
    showToast('拍照成功');
    console.log('图片base64地址---', generatedImg.value);
};
// 截图拍照
const takePhoto = async () => {
    try {
        showCamera.value = false;
        const video = document.getElementById('video')
        // 使用canvas画图当前相机图像
        const canvas = document.getElementById('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        // 得到base64图片
        generatedImg.value = canvas.toDataURL('image/png');
    } catch (error) {
        console.log(error);
    };
};
// 关闭摄像头
const stopMedia = () => {
    try {
        const video = document.getElementById('video');
        const stream = video.srcObject;
        const tracks = stream?.getTracks();
        if (tracks && Array.isArray(tracks)) {
            tracks.forEach(function (track) {
                track.stop();
            });
        };
        video.srcObject = null;
    } catch (error) {
        console.log(error);
    };
};
onMounted(() => {
    getMedia();
});
onBeforeUnmount(() => {
    stopMedia();
});
</script>
<style lang="less" scoped>
.pic-box {
    margin: 0 auto;
    margin-top: 30px;
    width: 294px;
    height: 294px;
    background: #9d9d9d;
    border-radius: 50%;
    border: 1px solid #ec6729;
    position: relative;

    .face-img {
        width: 292px;
        height: 292px;
        position: absolute;
        left: 0;
        top: 0;
    }

    #video {
        width: 292px;
        height: 292px;
        border-radius: 50%;
    }

    #canvas {
        width: 292px;
        height: 292px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .generated-img {
        width: 292px;
        height: 292px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
    }
}



.btn-box {
    margin-top: 20px;
    text-align: center;

    .icon-box {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .photo-img {
        width: 90px;
        height: 90px;
    }
}
</style>