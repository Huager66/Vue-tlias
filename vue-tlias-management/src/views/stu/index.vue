<script setup>
import { ref, onMounted } from 'vue'
// // 注意：这里的 api 路径需要根据你的实际项目结构来
import {
  queryPageApi,
  addApi,
  queryByIdApi,
  updateApi,
  deleteByIdApi,
  violationApi,
} from '@/api/stu'
import { queryAllApi1 } from '@/api/clazz'
import { ElMessage, ElMessageBox } from 'element-plus'

// ================= 1. 搜索与列表 =================
const searchStudent = ref({
  name: '',
  degree: '',
  clazzId: '',
})

const studentList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

// 查询列表
const search = async () => {
  const result = await queryPageApi(
    searchStudent.value.name,
    searchStudent.value.degree,
    searchStudent.value.clazzId,
    currentPage.value,
    pageSize.value,
  )
  if (result.code) {
    studentList.value = result.data.rows
    total.value = result.data.total
  }
}

// 清空搜索
const clear = () => {
  searchStudent.value = { name: '', degree: '', clazzId: '' }
  search()
}

// 分页
const handleSizeChange = () => search()
const handleCurrentChange = () => search()

// 字典数据
const degrees = ref([
  { name: '初中', value: 1 },
  { name: '高中', value: 2 },
  { name: '大专', value: 3 },
  { name: '本科', value: 4 },
  { name: '硕士', value: 5 },
  { name: '博士', value: 6 },
])
const clazzOptions = ref([])

onMounted(() => {
  search()
  queryAllClazz()
})

const queryAllClazz = async () => {
  const result = await queryAllApi1()
  if (result.code) {
    clazzOptions.value = result.data
  }
}

// ================= 2. 新增/修改学员 =================
const student = ref({
  id: '',
  name: '',
  no: '',
  gender: '',
  phone: '',
  degree: '',
  clazzId: '',
  idCard: '',
  isCollege: '',
  address: '',
  graduationDate: '',
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增学员')
const studentFormRef = ref()

const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  no: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
  degree: [{ required: true, message: '请选择最高学历', trigger: 'change' }],
  clazzId: [{ required: true, message: '请选择所属班级', trigger: 'change' }],
})

const addStudent = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增学员'
  student.value = {
    id: '',
    name: '',
    no: '',
    gender: '',
    phone: '',
    degree: '',
    clazzId: '',
    idCard: '',
    isCollege: '',
    address: '',
    graduationDate: '',
  }
  if (studentFormRef.value) {
    studentFormRef.value.resetFields()
  }
}

const editStudent = async (id) => {
  const result = await queryByIdApi(id)
  if (result.code) {
    dialogVisible.value = true
    dialogTitle.value = '编辑学员'
    student.value = result.data
  } else {
    ElMessage.error(result.msg)
  }
}

const saveStudent = async () => {
  if (!studentFormRef.value) return
  studentFormRef.value.validate(async (valid) => {
    if (valid) {
      let result
      if (student.value.id) {
        result = await updateApi(student.value)
      } else {
        result = await addApi(student.value)
      }
      if (result.code) {
        ElMessage.success('保存成功')
        dialogVisible.value = false
        search()
      } else {
        ElMessage.error(result.msg)
      }
    }
  })
}

// ================= 3. 删除与批量删除 =================
const selectedIds = ref([])

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

const deleteById = async (id) => {
  ElMessageBox.confirm('此操作将永久删除该学员, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await deleteByIdApi([id]) // 根据你的接口，这里可能要传数组
      if (result.code) {
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {})
}

const deleteByIds = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.error('请选择要删除的学员')
    return
  }
  ElMessageBox.confirm('此操作将永久删除选中的学员, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await deleteByIdApi(selectedIds.value)
      if (result.code) {
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {})
}

// ================= 4. 违纪处理 =================
const violationDialogVisible = ref(false)
const violationFormRef = ref()
const violationData = ref({
  id: '',
  violationCount: 0,
  violationScore: 0,
})

const handleViolation = (row) => {
  violationDialogVisible.value = true
  // 回显当前的违纪次数和扣分
  violationData.value = {
    id: row.id,
    violationCount: row.violationCount || 0,
    violationScore: row.violationScore || 0,
  }
}

const saveViolation = async () => {
  const result = await violationApi(violationData.value)
  if (result.code) {
    ElMessage.success('违纪处理成功')
    violationDialogVisible.value = false
    search()
  } else {
    ElMessage.error(result.msg)
  }
}
</script>

<template>
  <h1>学员管理</h1>

  <!-- 顶部搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchStudent" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchStudent.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="最高学历">
        <el-select v-model="searchStudent.degree" placeholder="请选择" style="width: 180px">
          <el-option v-for="d in degrees" :key="d.value" :label="d.name" :value="d.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级">
        <el-select v-model="searchStudent.clazzId" placeholder="请选择" style="width: 200px">
          <el-option v-for="c in clazzOptions" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 操作按钮 -->
  <div>
    <el-button type="primary" @click="addStudent">+ 添加学员</el-button>
    <el-button type="danger" @click="deleteByIds">- 批量删除</el-button>
  </div>

  <!-- 数据表格 -->
  <div class="container">
    <el-table
      :data="studentList"
      border
      style="width: 100%"
      height="400px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="no" label="学号" align="center" />
      <el-table-column prop="clazzName" label="班级" align="center" />
      <el-table-column prop="gender" label="性别" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column prop="degree" label="最高学历" align="center">
        <template #default="scope">
          <span v-for="d in degrees" :key="d.value">
            <span v-if="scope.row.degree === d.value">{{ d.name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="violationCount" label="违纪次数" align="center" />
      <el-table-column prop="violationScore" label="违纪扣分" align="center" />
      <el-table-column
        prop="updateTime"
        value-format="YYYY-MM-DD HH:mm:ss"
        label="最后操作时间"
        width="180px"
        align="center"
      />
      <el-table-column label="操作" width="220" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editStudent(scope.row.id)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleViolation(scope.row)"
            >违纪</el-button
          >
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页组件 -->
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

  <!-- ================= 新增/修改学员对话框 ================= -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
    <el-form :model="student" :rules="rules" ref="studentFormRef" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="student.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="no">
            <el-input v-model="student.no" placeholder="请输入学号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="student.gender" placeholder="请选择性别" style="width: 100%">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="student.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="最高学历" prop="degree">
            <el-select v-model="student.degree" placeholder="请选择" style="width: 100%">
              <el-option v-for="d in degrees" :key="d.value" :label="d.name" :value="d.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属班级" prop="clazzId">
            <el-select v-model="student.clazzId" placeholder="请选择" style="width: 100%">
              <el-option v-for="c in clazzOptions" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证号">
            <el-input v-model="student.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否在校">
            <el-select v-model="student.isCollege" placeholder="请选择" style="width: 100%">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系地址">
            <el-input v-model="student.address" placeholder="请输入联系地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业时间">
            <el-date-picker
              v-model="student.graduationDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStudent">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- ================= 违纪处理对话框 ================= -->
  <el-dialog v-model="violationDialogVisible" title="违纪处理" width="400px">
    <el-form :model="violationData" label-width="100px">
      <el-form-item label="违纪次数">
        <el-input-number v-model="violationData.violationCount" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="违纪扣分">
        <el-input-number v-model="violationData.violationScore" :min="0" style="width: 100%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="violationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveViolation">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin-top: 20px;
}
</style>
