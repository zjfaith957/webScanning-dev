<template>
  <div class="container">
    <div class="subNav">宝安区第一实验中学2020—2021学年度第二学期月考（数学）</div>
    <div class="main-container">
      <!-- 角标区域 -->
      <div class="el-tabs el-tabs--top badge">
        <div class="el-tabs__header is-top">
          <div class="el-tabs__nav-wrap is-top">
            <div class="el-tabs__nav-scroll">
              <div class="el-tabs__nav is-top" role="tablist">
                <div class="el-tabs__item is-top">
                  定位异常
                  <div class="badge-number" v-if="tabs[1]">{{ tabs[1] }}</div>
                </div>
                <div class="el-tabs__item is-top">
                  作答区异常
                  <div class="badge-number" v-if="tabs[8]">{{ tabs[8] }}</div>
                </div>
                <div class="el-tabs__item is-top">
                  考号异常
                  <div class="badge-number" v-if="tabs[2]">{{ tabs[2] }}</div>
                </div>
                <div class="el-tabs__item is-top">
                  考号重复
                  <div class="badge-number" v-if="tabs[3]">{{ tabs[3] }}</div>
                </div>
                <!-- <div class="el-tabs__item is-top">
                  选做题异常处理
                  <div class="badge-number" v-if="tabs[5]">{{ tabs[5] }}</div>
                </div> -->
                <div class="el-tabs__item is-top">
                  客观题异常
                  <div class="badge-number" v-if="tabs[6]">{{ tabs[6] }}</div>
                </div>
                <div class="el-tabs__item is-top">
                  缺考异常
                  <div class="badge-number" v-if="tabs[4]">{{ tabs[4] }}</div>
                </div>
                <div class="el-tabs__item is-top">
                  手阅打分异常
                  <div class="badge-number" v-if="tabs[7]">{{ tabs[7] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="定位异常" name="LocationException">
          <LocationException v-if="activeName === 'LocationException'" />
        </el-tab-pane>
        <el-tab-pane label="作答区异常" name="ResponseException">
          <ResponseException v-if="activeName === 'ResponseException'" />
        </el-tab-pane>
        <el-tab-pane label="考号异常" name="CandidateNuException">
          <CandidateNumberException :exceptionType="2" v-if="activeName === 'CandidateNuException'" />
        </el-tab-pane>
        <el-tab-pane label="考号重复" name="CandidateNuRepeat">
          <CandidateNumberException :exceptionType="3" v-if="activeName === 'CandidateNuRepeat'" />
        </el-tab-pane>
        <!-- <el-tab-pane label="选做题异常处理" name="OptionalException">
          <OptionalException v-if="activeName === 'OptionalException'" />
        </el-tab-pane> -->
        <el-tab-pane label="客观题异常" name="ObjectiveException">
          <ObjectiveException v-if="activeName === 'ObjectiveException'" />
        </el-tab-pane>
        <el-tab-pane label="缺考异常" name="AbsentException">
          <AbsentException v-if="activeName === 'AbsentException'" />
        </el-tab-pane>
        <el-tab-pane label="手阅打分异常" name="ScoreException">
          <ScoreException v-if="activeName === 'ScoreException'" />
        </el-tab-pane>
        <el-tab-pane label="其他异常" name="OtherException">
          <ResponseException v-if="activeName === 'OtherException'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, reactive } from 'vue'

import LocationException from './location-exception/LocationException.vue' // 定位异常
import ResponseException from './response-exception/ResponseException.vue' // 作答区异常
import CandidateNumberException from './candidate-number-exception/CandidateNumberException.vue' // 考号异常、考号重复
import OptionalException from './optional-exception/OptionalException.vue' // 选做题异常
import ObjectiveException from './objective -exception/ObjectiveException.vue' // 客观题异常
import AbsentException from './absent-exception/AbsentException.vue' // 缺考异常
import ScoreException from './score-exception/ScoreException.vue' // 手阅打分异常

import Api from '@/api/scan/exception-api'

const activeName = ref('LocationException')
const badge = ref(21)
const state = reactive({
  tabs: <any>Object,
})
const { tabs } = toRefs(state)
const handleClick = (tab: any, event: MouseEvent) => {}
onMounted(async () => {
  const res = await Api.getExceptionCount('161163262882282700009', '161163262882284200010', '1')
  tabs.value = res.data
})
</script>

<style lang="scss" scoped>
.container {
  .subNav {
    height: 40px;
    line-height: 40px;
    background: #0090ff;
    font-size: 18px;
    color: #ffffff;
    padding: 0 20px;
  }
}
.main-container {
  border-bottom: 1px solid #e7e7e7;
  border-radius: 5px;
  position: relative;
  // 角标样式
  .badge {
    position: absolute;
    .el-tabs__item {
      padding: 0 20px;
      color: #fff;
      &:first-of-type {
        padding-left: 0;
      }
      > .badge-number {
        position: absolute;
        right: 0;
        top: 0;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        border-radius: 10px;
        background: #f24646;
        color: #ffffff;
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
  :deep(.el-tabs__header) {
    height: 46px;
    line-height: 46px;
    background: #ffffff;
    margin: 0;
    .el-tabs__nav {
      padding: 0 20px;
    }
    .el-tabs__nav > .el-tabs__item {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
