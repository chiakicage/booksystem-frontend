<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserManageStore } from '../store/userManageStore'
import { useUserStore } from '../store/userStore'
import { useBorrowStore } from '../store/borrowStore'
import { sha256 } from 'js-sha256'
import { ElMessage, FormInstance } from 'element-plus'


import { mande } from 'mande'
import { rangeRight } from 'lodash'

const user = mande('http://localhost:8080/api/users/')
const userManageStore = useUserManageStore()
const editDialog = ref(false)
const editingUser = ref({
	name: '',
	number: '',
	department: '',
	type: 'student',
	password1: '',
	password2: ''
})
const checkPass = (rule: any, value: any, callback: any) => {
	if (value !== editingUser.value.password1) {
		callback(new Error("两次密码输入不一致！"))
	} else {
		callback()
	}
}
const rules = reactive({
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' },
	],
	department: [
		{ required: true, message: '请输入部门', trigger: 'blur' },
	],
	password2: [
		{ validator: checkPass, trigger: 'blur' }
	]
})


const handleEdit = async (user: any) => {
	editDialog.value = true
	editingUser.value.name = user.name
	editingUser.value.number = user.number
	editingUser.value.department = user.department
	editingUser.value.type = user.type
	editingUser.value.password1 = ''
	editingUser.value.password2 = ''
}
const ruleFormRef = ref<FormInstance>()
const submitEdit = async (formEl: FormInstance | undefined) => {
	if (formEl) {
		let valid = await (new Promise<Boolean>((resolve) => {
			formEl.validate((valid) => resolve(valid))
		}))
		if (valid) {
			try {
				let res = await user.get<Record<string, any>>('edit', {
					query: {
						number: editingUser.value.number,
						name: editingUser.value.name,
						department: editingUser.value.department,
						type: editingUser.value.type,
						password: sha256(editingUser.value.password1 + '_librarysys')
					}
				})
				if (res.code === 0) {
					await userManageStore.getusers()
					editDialog.value = false
					editingUser.value = {
						name: '',
						number: '',
						department: '',
						type: 'student',
						password1: '',
						password2: ''
					}
					ElMessage({
						type: 'success',
						message: '修改成功',
						duration: 1000
					})
				} else {
					ElMessage({
						type: 'error',
						message: '修改失败',
						duration: 1000
					})
				}
			} catch (err) {
	
			}
		} else {
			// console.log('error submit!')
			// return false
		}
	}

}
const deletePopover = ref(false)
const handleDelete = async (number: string) => {
	let index = userManageStore.users.findIndex((u) => u.number === number)
	userManageStore.users.splice(index, 1)
	try {
		let res = await user.get<Record<string, any>>('delete', {
			query: {
				number
			}
		})
		if (res.code === 0) {
			ElMessage({
				message: '删除成功',
				type: 'success',
				duration: 1000
			})
			await userManageStore.getusers()
		} else {

		}
	} catch (err) {

	}
}
const rules2 = reactive({
	number: [
		{ required: true, message: '请输入借书证号', trigger: 'blur' },
	],
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' },
	],
	department: [
		{ required: true, message: '请输入部门', trigger: 'blur' },
	],
	password1: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
	],
	password2: [
		{ validator: checkPass, trigger: 'blur' }
	]
})
const newDialog = ref(false)
const handleCreate = async () => {
	newDialog.value = true
	editingUser.value.name = ''
	editingUser.value.number = ''
	editingUser.value.department = ''
	editingUser.value.type = 'student'
	editingUser.value.password1 = ''
	editingUser.value.password2 = ''
}
const ruleFormRef2 = ref<FormInstance>()
const submitCreate = async (formEl: FormInstance | undefined) => {
	if (formEl) {
		let valid = await (new Promise<Boolean>((resolve) => {
			formEl.validate((valid) => resolve(valid))
		}))
		if (valid) {
			try {
				let res = await user.post<Record<string, any>>('create', {
					number: editingUser.value.number,
					name: editingUser.value.name,
					department: editingUser.value.department,
					type: editingUser.value.type,
					password: sha256(editingUser.value.password1 + '_librarysys')
				})
				if (res.code === 0) {
					await userManageStore.getusers()
					newDialog.value = false
					editingUser.value = {
						name: '',
						number: '',
						department: '',
						type: 'student',
						password1: '',
						password2: ''
					}
					ElMessage({
						type: 'success',
						message: '添加成功',
						duration: 1000
					})
				} else {
					ElMessage({
						type: 'error',
						message: '添加失败',
						duration: 1000
					})
				}
			} catch (err) {
	
			}
		} else {
			// console.log('error submit!')
			// return false
		}
	}

}

</script>
<template>
	<el-dialog v-model="editDialog" title="修改用户" width="400px" center>
		<el-form label-width="80px" ref="ruleFormRef" :rules="rules" :model="editingUser">
			<el-form-item label="借书证号" prop="number">
				<el-input v-model="editingUser.number" disabled></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="editingUser.name"></el-input>
			</el-form-item>
			<el-form-item label="部门" prop="department">
				<el-input v-model="editingUser.department"></el-input>
			</el-form-item>
			<el-form-item label="用户类型" prop="type">
				<el-select v-model="editingUser.type" style="width: 100%;">
					<el-option label="student" value="student"></el-option>
					<el-option label="teacher" value="teacher"></el-option>
					<el-option label="admin" value="admin"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="修改密码" prop="password1">
				<el-input v-model="editingUser.password1"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="password2">
				<el-input v-model="editingUser.password2"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="editDialog = false; ruleFormRef?.resetFields()">取消</el-button>
			<el-button type="primary" @click="submitEdit(ruleFormRef)">提交</el-button>
		</template>
	</el-dialog>
	<el-dialog v-model="newDialog" title="创建新用户" width="400px" center>
		<el-form label-width="80px" ref="ruleFormRef2" :rules="rules2" :model="editingUser">
			<el-form-item label="借书证号" prop="number">
				<el-input v-model="editingUser.number"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="editingUser.name"></el-input>
			</el-form-item>
			<el-form-item label="部门" prop="department">
				<el-input v-model="editingUser.department"></el-input>
			</el-form-item>
			<el-form-item label="用户类型" prop="type">
				<el-select v-model="editingUser.type" style="width: 100%;">
					<el-option label="student" value="student"></el-option>
					<el-option label="teacher" value="teacher"></el-option>
					<el-option label="admin" value="admin"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="设置密码" prop="password1">
				<el-input v-model="editingUser.password1"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="password2">
				<el-input v-model="editingUser.password2"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="newDialog = false; ruleFormRef2?.resetFields()">取消</el-button>
			<el-button type="primary" @click="submitCreate(ruleFormRef2)">提交</el-button>
		</template>
	</el-dialog>
	<el-container class="book-container">
		<el-main class="main-usermanage">
			<el-table :data="userManageStore.users" style="width: 100%;">
				<el-table-column prop="number" label="借书证号" width="160" />
				<el-table-column prop="name" label="姓名" width="160" />
				<el-table-column prop="department" label="部门" width="160" />
				<el-table-column prop="type" label="类别" width="160" />
				<el-table-column label="操作">
					<template #default="scope">
						<el-button size="small" @click="handleEdit(scope.row)" :disabled="scope.row.number === 'admin'">修改
						</el-button>
						<el-button type="danger" size="small" :disabled="scope.row.number === 'admin'"
							@click="handleDelete(scope.row.number)">删除</el-button>
					</template>

				</el-table-column>
			</el-table>
		</el-main>
		<el-footer class="book-pages">
			<el-pagination v-model:current-page="userManageStore.page" @current-change="userManageStore.getusers()"
				:page-size="10" :background="true" layout="total, prev, pager, next, jumper" :total="userManageStore.total" />
			<el-button type="primary" @click="handleCreate"> 添加用户 </el-button>
		</el-footer>
	</el-container>
</template>
<style>
.book-container {
	height: 100%;
	padding: 0;
}

.book-container>.book-pages {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.main-usermanage {
	display: flex;
	flex-direction: row;
	justify-content: center;
	/* align-items: center; */
}
</style>
