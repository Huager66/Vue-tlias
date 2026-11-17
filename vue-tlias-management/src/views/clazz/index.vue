<script setup>
import { ref, watch, onMounted } from 'vue'
// 注意：这里的 api 路径需要根据你的实际项目结构来，比如 '@/api/clazz'
import { queryAllApi, addApi, updateApi, queryByIdApi, deleteByIdApi } from '@/api/clazz'
// 假设需要查询所有员工来作为班主任下拉框的数据
import { queryAllApi1 } from '@/api/emp'
import { ElMessage, ElMessageBox } from 'element-plus'

// 1. 搜索条件
const searchClazz = ref({
  name: '',
  date: '', // 结课时间范围
  begin: '',
  end: '',
})

// 监听结课时间选择器的变化，拆分成开始和结束时间
watch(
  () => searchClazz.value.date,
  (newVal, oldVal) => {
    if (newVal && newVal.length == 2) {
      searchClazz.value.begin = newVal[0]
      searchClazz.value.end = newVal[1]
    } else {
      searchClazz.value.begin = ''
      searchClazz.value.end = ''
    }
  },
)

// 查询列表
const search = async () => {
  const result = await queryAllApi(
    searchClazz.value.name,
    searchClazz.value.begin,
    searchClazz.value.end,
    currentPage.value,
    pageSize.value,
  )
  if (result.code) {
    clazzList.value = result.data.rows
    console.log(clazzList)
    total.value = result.data.total
  }
}

// 清空搜索条件
const clear = () => {
  searchClazz.value = { name: '', date: '', begin: '', end: '' }
  search()
}

const clazzList = ref([])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

const handleSizeChange = (val) => {
  search()
}

const handleCurrentChange = (val) => {
  search()
}

// 2. 新增/修改表单数据
const clazz = ref({
  id: '',
  name: '',
  room: '',
  masterId: '',
  beginTime: '',
  updateTime: '',
  status: '',
  subject: '',
})

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增班级')
const clazzFormRef = ref()

// 班主任列表数据（从员工表查询）
const masters = ref([])

const queryAllMasters = async () => {
  const result = await queryAllApi1()
  console.log(result)
  if (result.code) {
    masters.value = result.data
  }
}

// 状态列表数据
const statuses = ref([
  { name: '未开班', value: 1 },
  { name: '在读', value: 2 },
  { name: '已结课', value: 3 },
])
//1:初中, 2:高中, 3:大专, 4:本科, 5:硕士, 6:博士
const subject = ref([
  { name: '初中', value: 1 },
  { name: '高中', value: 2 },
  { name: '大专', value: 3 },
  { name: '本科', value: 4 },
  { name: '硕士', value: 5 },
  { name: '博士', value: 6 },
])
onMounted(() => {
  search()
  queryAllMasters()
})

// 点击新增
const addClazz = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增班级'
  clazz.value = {
    id: '',
    name: '',
    room: '',
    masterId: '',
    createTime: '',
    Time: '',
    status: '',
  }
  if (clazzFormRef.value) {
    clazzFormRef.value.resetFields()
  }
}

// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 2, max: 30, message: '班级名称长度应在2到30个字符之间', trigger: 'blur' },
  ],
  room: [{ required: true, message: '请输入班级教室', trigger: 'blur' }],
  masterId: [{ required: true, message: '请选择班主任', trigger: 'blur' }],
  beginDate: [{ required: true, message: '请选择开课时间', trigger: 'blur' }],
  endDate: [{ required: true, message: '请选择结课时间', trigger: 'blur' }],
  subject: [{ required: true, message: '请选择学科', trigger: 'blur' }],
})

// 保存
const save = async () => {
  if (!clazzFormRef.value) return
  clazzFormRef.value.validate(async (valid) => {
    if (valid) {
      let result
      if (clazz.value.id) {
        result = await updateApi(clazz.value)
      } else {
        result = await addApi(clazz.value)
      }
      if (result.code) {
        ElMessage.success('保存成功')
        dialogVisible.value = false
        search()
      } else {
        ElMessage.error(result.msg)
      }
    } else {
      ElMessage.error('校验不通过')
    }
  })
}

//点击编辑
const edit = async (id) => {
  const result = await queryByIdApi(id)
  dialogVisible.value = true
  dialogTitle.value = '修改班级'
  if (result.code) {
    clazz.value = result.data
  } else {
    ElMessage.error(result.msg)
  }
}

//删除
const deleteById = async (id) => {
  ElMessageBox.confirm('此操作将永久删除该班级, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      console.log(id)
      const result = await deleteByIdApi(id)

      if (result.code) {
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
</script>

<template>
  <h1>班级管理</h1>
  <!-- 顶部搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
      <el-form-item label="班级名称">
        <el-input v-model="searchClazz.name" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="结课时间">
        <el-date-picker
          v-model="searchClazz.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 操作按钮 -->
  <div>
    <el-button type="primary" @click="addClazz">+ 新增班级</el-button>
  </div>

  <!-- 数据表格 -->
  <div class="container">
    <el-table :data="clazzList" border style="width: 100%" height="450px">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="name" label="班级名称" align="center" />
      <el-table-column prop="room" label="班级教室" align="center" />
      <el-table-column prop="masterName" label="班主任" align="center" />
      <el-table-column prop="beginDate" label="开课时间" align="center" />
      <el-table-column prop="endDate" label="结课时间" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <span v-if="scope.row.status == 1">未开班</span>
          <span v-else-if="scope.row.status == 2">在读</span>
          <span v-else-if="scope.row.status == 3">已结课</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        value-format="YYYY-MM-DD HH:mm:ss"
        label="最后操作时间"
        width="180px"
        align="center"
      />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)">
            <el-icon><EditPen /></el-icon> 编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
  </div>
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

  <!-- 新增/修改班级的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
    <el-form :model="clazz" :rules="rules" ref="clazzFormRef" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="班级名称" prop="name">
            <el-input v-model="clazz.name" placeholder="请输入班级名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班级教室" prop="room">
            <el-input v-model="clazz.room" placeholder="请输入班级教室"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班主任" prop="masterId">
            <el-select v-model="clazz.masterId" placeholder="请选择班主任" style="width: 100%">
              <el-option v-for="m in masters" :key="m.id" :label="m.name" :value="m.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开课时间" prop="beginDate">
            <el-date-picker
              v-model="clazz.beginDate"
              type="date"
              style="width: 100%"
              placeholder="选择开课时间"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结课时间" prop="endDate">
            <el-date-picker
              v-model="clazz.endDate"
              type="date"
              style="width: 100%"
              placeholder="选择结课时间"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="clazz.status" placeholder="请选择状态" style="width: 100%">
              <el-option
                v-for="s in statuses"
                :key="s.value"
                :label="s.name"
                :value="s.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学科" prop="subject">
            <el-select v-model="clazz.subject" placeholder="请选择学科" style="width: 100%">
              <el-option
                v-for="s in subject"
                :key="s.value"
                :label="s.name"
                :value="s.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin-top: 5px;
}
</style>
