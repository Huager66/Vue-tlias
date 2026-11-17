<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

const deptList = ref([])
const search = async () => {
  console.log(deptList)
  const result = await queryAllApi()
  if (result.code) {
    deptList.value = result.data
  }
}

onMounted(() => {
  search()
})
const dialogFormVisible = ref(false)

const addDept = () => {
  dialogFormVisible.value = true
  formTitle.value = '新增部门'
  dept.value = {}
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }
}
const dept = ref({ name: '' })
const formTitle = ref('')
const save = async () => {
  if (!deptFormRef.value) return
  deptFormRef.value.validate(async (valid) => {
    //val
    if (valid) {
      //通过
      let result

      if (dept.value.id) {
        //修改
        result = await updateApi(dept.value)
      } else {
        //新增
        result = await addApi(dept.value)
      }

      if (result.code) {
        ElMessage.success('保存成功')
        dialogFormVisible.value = false
        search()
      } else {
        ElMessage.error(result.msg)
      }
    } else {
      ElMessage.error('校验不通过')
    }
  })
}

const rules = ref({
  name: [
    { required: true, message: '部门名称是必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度应该在2-10位', trigger: 'blur' },
  ],
})
const deptFormRef = ref()
const edit = async (id) => {
  formTitle.value = '修改部门'
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }
  const result = await queryByIdApi(id)
  if (result.code) {
    dialogFormVisible.value = true
    dept.value = result.data
  } else {
    ElMessage.error(result.msg)
  }
}

const delById = async (id) => {
  ElMessageBox.confirm('您确认删除该部门吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      //确认
      const result = await deleteByIdApi(id)
      if (result.code) {
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {
      //取消
      ElMessage.info('您已取消删除')
    })
}
</script>
<template>
  <h1>新增部门</h1>
  <el-button type="primary" @click="addDept">+新增部门</el-button>
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="name" label="部门名称" width="260" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"
            ><el-icon><EditPen /></el-icon> 编辑</el-button
          >
          <el-button type="danger" size="small" @click="delById(scope.row.id)"
            ><el-icon><Delete /></el-icon> 删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.container {
  margin-top: 20px;
}
</style>
