<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../store/userStore'
import { useBorrowStore } from '../store/borrowStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { mande } from 'mande'

const submitList = mande('http://localhost:8080/api/books')
const books = ref([])


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
