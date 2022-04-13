<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '../store/userStore'
import { useBorrowStore } from '../store/borrowStore'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { mande } from 'mande'

const submitList = mande('/api/books')
interface BookInfo {
	name: string,
	number: string,
	type: string,
	press: string,
	time: string,
	author: string,
	price: string,
	count: string
}
const books = ref<BookInfo[]>([])
const ruleFormRef = ref<FormInstance>()

const newBook = ref<BookInfo>({
	name: '',
	number: '',
	type: '',
	press: '',
	time: '',
	author: '',
	price: '',
	count: ''
})
const isNumber = (value: string) => {
	if (value.length === 0 || isNaN(Number(value))) return false
	return true
}
const isInt = (value: string) => {
	if (value.length === 0 || isNaN(Number(value)) || parseInt(value) !== parseFloat(value))
		return false
	return true
}
const checkNumber = (rule: any, value: string, callback: any) => {
	if (!isNumber(value)) {
		callback(new Error("请输入数字"))
	} else {
		callback()
	}
}
const checkInt = (rule: any, value: string, callback: any) => {
	if (!isInt(value)) {
		callback(new Error("请输入整数"))
	} else {
		callback()
	}
}
const newBookDialog = ref(false)
const rules = reactive({
	name: [
		{ required: true, message: '请输入书名', trigger: 'blur' },
	],
	number: [
		{ required: true, message: '请输入书名', trigger: 'blur' },
	],
	type: [
		{ required: true, message: '请输入类别', trigger: 'blur' },
	],
	press: [
		{ required: true, message: '请输入出版社', trigger: 'blur' },
	],
	time: [
		{ required: true, validator: checkInt, message: '请输入整数', trigger: 'blur' },
	],
	author: [
		{ required: true, message: '请输入作者', trigger: 'blur' },
	],
	price: [
		{ required: true, validator: checkNumber, message: '请输入数字', trigger: 'blur' },
	],
	count: [
		{ required: true, validator: checkInt, message: '请输入整数', trigger: 'blur' },
	],
})
const addBook = async (formEl: FormInstance | undefined) => {
	if (formEl) {
		let valid = await (new Promise<Boolean>((resolve) => {
			formEl.validate((valid) => resolve(valid))
		}))
		if (valid) {
			newBookDialog.value = false
			let book = {
				...newBook.value
			}
			formEl.resetFields()
			books.value.push(book)
		} else {
			// console.log('error submit!')
			// return false
		}
	}

}
const beforeUpload: UploadProps['beforeUpload'] = (uploadFile) => {
	console.log(uploadFile)
}
const onSuccess = (response: any) => {
	console.log(response.data)
	books.value = response.data
}
const submit = async () => {
	await submitList.post('import', {
		data: books.value
	})
	books.value = []
	ElMessage({
		type: 'success',
		duration: 1000,
		message: '导入成功'
	})
}
const editBookDialog = ref(false)
const ruleFormRef2 = ref<FormInstance>()
const editBook = async (formEl: FormInstance | undefined) => {
	if (formEl) {
		let valid = await (new Promise<Boolean>((resolve) => {
			formEl.validate((valid) => resolve(valid))
		}))
		if (valid) {
			editBookDialog.value = false
			let index = books.value.findIndex((e) => e.number === newBook.value.number)
			books.value[index] = {
				...newBook.value
			}
			// formEl.resetFields()
		} else {
			// console.log('error submit!')
			// return false
		}
	}
}
const handleEdit = (book: BookInfo) => {
	editBookDialog.value = true
	newBook.value = {
		...book
	}
	
}
const handleDelete = (number: string) => {
	let index = books.value.findIndex((e) => e.number === newBook.value.number)
		books.value[index] = {
			...newBook.value
		}
		books.value.splice(index, 1)
}
const cancel = (formEl: FormInstance | undefined) => {
	if (formEl) {
		formEl.resetFields()
		newBookDialog.value = false
	}
}

const validBooks = ({
  row,
  rowIndex,
}: {
  row: BookInfo
  rowIndex: number
}) => {
	if (
		row.name.length === 0 ||
		row.author.length === 0 ||
		!isInt(row.count) || 
		row.number.length === 0 ||
		row.press.length === 0 || 
		!isNumber(row.price) ||
		!isInt(row.time) ||
		row.type.length === 0
	) return 'danger-row'
	return ''
}
</script>
<template>
	<el-dialog v-model="newBookDialog" title="增加新书" width="400px" center>
		<el-form label-width="80px" ref="ruleFormRef" :rules="rules" :model="newBook">
			<el-form-item label="书号" prop="number">
				<el-input v-model="newBook.number"></el-input>
			</el-form-item>
			<el-form-item label="书名" prop="name">
				<el-input v-model="newBook.name"></el-input>
			</el-form-item>
			<el-form-item label="类别" prop="type">
				<el-input v-model="newBook.type"></el-input>
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<el-input v-model="newBook.price"></el-input>
			</el-form-item>
			<el-form-item label="时间" prop="time">
				<el-input v-model="newBook.time"></el-input>
			</el-form-item>
			<el-form-item label="出版社" prop="press">
				<el-input v-model="newBook.press"></el-input>
			</el-form-item>
			<el-form-item label="作者" prop="author">
				<el-input v-model="newBook.author"></el-input>
			</el-form-item>
			<el-form-item label="数量" prop="count">
				<el-input v-model="newBook.count"></el-input>
			</el-form-item>

		</el-form>
		<template #footer>
			<el-button @click="cancel(ruleFormRef)">取消</el-button>
			<el-button type="primary" @click="addBook(ruleFormRef)">提交</el-button>
		</template>
	</el-dialog>
	<el-dialog v-model="editBookDialog" title="修改信息" width="400px" center>
		<el-form label-width="80px" ref="ruleFormRef2" :rules="rules" :model="newBook">
			<el-form-item label="书号" prop="number" >
				<el-input v-model="newBook.number" disabled></el-input>
			</el-form-item>
			<el-form-item label="书名" prop="name">
				<el-input v-model="newBook.name"></el-input>
			</el-form-item>
			<el-form-item label="类别" prop="type">
				<el-input v-model="newBook.type"></el-input>
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<el-input v-model="newBook.price"></el-input>
			</el-form-item>
			<el-form-item label="时间" prop="time">
				<el-input v-model="newBook.time"></el-input>
			</el-form-item>
			<el-form-item label="出版社" prop="press">
				<el-input v-model="newBook.press"></el-input>
			</el-form-item>
			<el-form-item label="作者" prop="author">
				<el-input v-model="newBook.author"></el-input>
			</el-form-item>
			<el-form-item label="数量" prop="count">
				<el-input v-model="newBook.count"></el-input>
			</el-form-item>

		</el-form>
		<template #footer>
			<el-button @click="editBookDialog = false; ruleFormRef2?.resetFields()">取消</el-button>
			<el-button type="primary" @click="editBook(ruleFormRef2)">确认</el-button>
		</template>
	</el-dialog>
	<el-container class="book-container">
		<el-main>
			<el-table :data="books" style="width: 100%" height="100%" :row-class-name="validBooks">
				<el-table-column fixed prop="name" label="书名" width="120" />
				<el-table-column prop="number" label="书号" width="120" />
				<el-table-column prop="type" label="类别" width="120" />
				<el-table-column prop="press" label="出版社" width="120" />
				<el-table-column prop="author" label="作者" width="120" />
				<el-table-column prop="time" label="年份" width="120" />
				<el-table-column prop="price" label="价格" width="120" />
				<el-table-column prop="count" label="数量" width="120" />
				<el-table-column label="操作" fixed="right" width="160">
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
			<el-row justify="space-between"  style="width: 80%;">
				<el-col :span="8">
					<el-upload class="upload-demo" action="/api/books/parse" :before-upload="beforeUpload"
						:on-success="onSuccess" accept="text/plain" :show-file-list="false">
						<el-button>上传书单</el-button>
					</el-upload>
				</el-col>
				<el-col :span="8">
					<el-button @click="newBookDialog = true; ">添加新书</el-button>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" @click="submit">提交</el-button>
				</el-col>
			</el-row>
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
.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>
