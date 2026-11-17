<template>
  <div class="log-container">
    <el-card>
      <!-- 顶部标题 -->
      <template #header>
        <div class="card-header">
          <span>操作日志列表</span>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        stripe
        style="width: 100%; height: 500px"
        class="cs"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="operateEmpName" label="操作人" width="120" align="center" />
        <el-table-column prop="operateTime" label="操作时间" width="180" align="center" />
        <el-table-column prop="className" label="类名" show-overflow-tooltip />
        <el-table-column prop="methodName" label="方法名" width="150" show-overflow-tooltip />
        <el-table-column prop="methodParams" label="请求参数" show-overflow-tooltip />
        <el-table-column prop="returnValue" label="返回值" show-overflow-tooltip />
        <el-table-column prop="costTime" label="耗时(ms)" width="100" align="center" />
      </el-table>
    </el-card>
    <div class="container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 60]"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// TODO: 请替换为你自己实际封装的 API
import { getOperateLogPageApi } from '@/api/empReport'

// --- 状态定义 ---
const tableData = ref([]) // 表格数据
const loading = ref(false) // 加载状态

// --- 查询列表方法 ---
const getList = async () => {
  loading.value = true
  try {
    const result = await getOperateLogPageApi(currentPage.value, pageSize.value)
    // 根据你的接口文档，数据在 result.data.rows 里
    if (result.code == 1) {
      tableData.value = result.data.rows
      total.value = result.data.total
    } else {
      ElMessage.error(result.msg || '查询失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络请求异常')
  } finally {
    loading.value = false
  }
}
const handleSizeChange = (val) => {
  getList()
}

const handleCurrentChange = (val) => {
  getList()
}
// --- 页面加载时获取数据 ---
onMounted(() => {
  getList()
})
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)
</script>

<style scoped>
.card-header {
  font-weight: bold;
  font-size: 16px;
}
</style>
