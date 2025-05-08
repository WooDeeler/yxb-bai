<template>
  <div class="major-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="所属院校">
          <el-input v-model="queryParams.universityName" placeholder="请输入院校名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="handleAdd">新增专业</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="majorList"
      style="width: 100%; margin-top: 20px"
      border
    >
      <el-table-column prop="majorName" label="专业名称" width="250" />
      <el-table-column prop="universityName" label="所属院校" width="250" />
      <el-table-column prop="type" label="专业类型" width="200">
        <template #default="{ row }">
          {{ majorTypeMap[row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="years" label="年份" width="150" />
      <el-table-column prop="score" label="分数线" min-width="100" show-overflow-tooltip />
      <el-table-column prop="countryScore" label="国家线" width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="total > 0"
      :current-page="queryParams.page"
      :page-size="queryParams.size"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle === 'add' ? '新增专业' : '编辑专业'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="majorFormRef"
        :model="majorForm"
        :rules="majorRules"
        label-width="100px"
      >
        <el-form-item label="专业名称" prop="majorName">
          <el-input v-model="majorForm.majorName" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="专业类型" prop="type">
          <el-select v-model="majorForm.type" placeholder="请选择专业类型">
            <el-option v-for="(label, value) in majorTypeMap" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年份" prop="years">
          <el-input v-model="majorForm.years" placeholder="请输入年份" />
        </el-form-item>
        <el-form-item label="分数线" prop="score">
          <el-input v-model="majorForm.score" placeholder="请输入分数线" />
        </el-form-item>
        <el-form-item label="国家线" prop="countryScore">
          <el-input v-model="majorForm.countryScore" placeholder="请输入国家线" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { majorApi } from '@/api'


// 查询参数
const queryParams = reactive({
  page: 1,
  size: 10,
  majorName: '',
  universityName: ''
})

// 表格数据
const loading = ref(false)
const majorList = ref([])
const total = ref(0)
const schoolOptions = ref([])

// 表单数据
const dialogVisible = ref(false)
const dialogTitle = ref('add')
const majorFormRef = ref(null)
const majorForm = reactive({
  id: '',
  universityId: '',
  universityName: '',
  majorName: '',
  years: '',
  type: '',
  score: '',
  countryScore: ''
})

const majorTypeMap = {
  1: '工科',
  2: '理科',
  3: '文史类',
  4: '艺术类',
  5: '体育类'  
}

// 表单校验规则
const majorRules = {
  majorName: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
  years: [{ required: true, message: '请输入年份', trigger: 'blur' }],
  type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分数线', trigger: 'blur' }],
  countryScore: [{ required: true, message: '请输入国家线', trigger: 'blur' }]
}

// 获取院校专业列表
const getMajorList = async () => {
  try {
    loading.value = true
   const res = await majorApi.condQuery({
        page: queryParams.page,
        size: queryParams.size,
        univName: queryParams.universityName
    })
    majorList.value = res.data.data.list
    total.value = res.data.data.total
  } catch (error) {
    console.error('获取院校列表失败:', error)
  } finally {
    loading.value = false
  }
}


// 查询
const handleQuery = () => {
  queryParams.page = 1
  getMajorList()
}

// 重置
const resetQuery = () => {
  queryParams.universityName = ''
  handleQuery()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = 'add'
  dialogVisible.value = true
  Object.keys(majorForm).forEach(key => {
    majorForm[key] = ''
  })
}

const resetForm = () => {
  majorForm.id = ''
  majorForm.majorName = ''
  majorForm.years = ''
  majorForm.type = ''
  majorForm.score = ''
  majorForm.countryScore = ''
  majorFormRef.value?.resetFields()
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = 'update'
  dialogVisible.value = true
  Object.keys(majorForm).forEach(key => {
    majorForm[key] = row[key]
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该专业吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    try {
      const formData = new FormData();
      formData.append('id', row.id);
      majorApi.delete(formData)
      ElMessage.success('删除成功')
      handleQuery()
    } catch (error) {
      console.error('删除专业失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单
const submitForm = () => {
    majorFormRef.value?.validate(valid => {
    if (valid) {
      try {
        if (dialogTitle.value === 'add' && majorList.value.length > 0) {
          // 从majorList中获取第一条记录的院校信息
          const firstMajor = majorList.value[0]
          majorForm.universityId = firstMajor.universityId
          majorForm.universityName = firstMajor.universityName
          majorApi.create(majorForm)
          ElMessage.success('新增成功')
        } else {
          majorApi.update(majorForm)
          ElMessage.success('编辑成功')
        }
        handleQuery()
        dialogVisible.value = false
      } catch (error) {
        console.log(error)
        ElMessage.error(dialogTitle.value === 'add' ? '新增失败' : '编辑失败')
      }
    }
  })
}

// 分页
const handleCurrentChange = (page) => {
  queryParams.page = page
  getMajorList()
}

const handleSizeChange = (size) => {
  queryParams.limit = size
  getMajorList()
}

onMounted(() => {
  getMajorList()
})
</script>

<style scoped>
.major-container {
  padding: 20px;
}

.search-bar {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>




