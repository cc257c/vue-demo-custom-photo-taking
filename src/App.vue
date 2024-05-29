<template>
  <div class="title">前端实现移动端自定义界面拍照</div>
  <van-tabs v-model:active="active">
    <van-tab title="前置摄像头">
    </van-tab>
    <van-tab title="后置摄像头">
    </van-tab>
  </van-tabs>
  <Post v-if="active == 0"></Post>
  <Pre v-if="active == 1"></Pre>
</template>
<script setup>
import Post from './components/post.vue';
import Pre from './components/pre.vue';
import { ref } from 'vue';
const active = ref(0);
</script>
<style lang="less" scoped>
.title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin: 20px 0;
}
</style>

