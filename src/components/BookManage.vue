<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '../store/userStore'
import { useBorrowStore } from '../store/borrowStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { mande } from 'mande'

const submitList = mande('http://localhost:8080/api/books')
interface BookInfo {
	name: string,
	number: string,
	type: string,
	press: string,
	time: number,
	author: string,
	price: string,
	count: string
}
const books = ref<BookInfo[]>([])


const newBook = ref<BookInfo>({
	name: '',
	number: '',
	type: '',
	press: '',
	time: 0,
	author: '',
	price: '',
	count: ''
})
const newBookDialog = ref(false)
const rules = reactive({

})
const addBook = () => {
	newBookDialog.value = false
	let book = {
		...newBook.value
	}
	books.value.push(book)
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
</script>
<template>
	<el-dialog v-model="newBookDialog" title="增加新书" width="400px" center >
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
			<el-button @click="newBookDialog = false">取消</el-button>
			<el-button type="primary" @click="addBook">提交</el-button>
    </template>
	</el-dialog>
	<el-container class="book-container">
		<el-main>
			<el-table :data="books" style="width: 100%" height="100%">
				<el-table-column fixed prop="name" label="书名" width="120" />
				<el-table-column prop="number" label="书号" width="120" />
				<el-table-column prop="type" label="类别" width="120" />
				<el-table-column prop="press" label="出版社" width="120" />
				<el-table-column prop="author" label="作者" width="120" />
				<el-table-column prop="time" label="年份" width="120" />
				<el-table-column prop="price" label="价格" width="120" />
				<el-table-column prop="count" label="数量" width="120" />
			</el-table>
		</el-main>
		<el-footer class="book-pages">
			<el-row justify="space-between" style="width: 40%;">
				<el-col :span="8">
					<el-upload
						class="upload-demo"
						action="http://localhost:8080/api/books/parse"
						:before-upload="beforeUpload"
						:on-success="onSuccess"
						accept="text/plain"
						:show-file-list="false"
					>
						<el-button >上传书单</el-button>
					</el-upload >
				</el-col>
				<el-col :span="8">
					<el-button @click="newBookDialog = true">添加新书</el-button>
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
.book-container > .book-pages {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
