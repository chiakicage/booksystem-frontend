<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../store/userStore'
import { useBorrowStore } from '../store/borrowStore'

import { ElMessage } from 'element-plus'

import { mande } from 'mande'

const borrow = mande('http://localhost:8080/api/borrows')
const userStore = useUserStore()
const borrowStore = useBorrowStore()

const handleReturn = async (id: number) => {
	// console.log('click')
	await borrow.get('return', {
		query: {
			borrowId: id
		}
	})
	ElMessage({
		message: '还书成功',
		type: 'success',
		duration: 1000
	})
	borrowStore.getborrows()
}
const handleRenew = async (id: number) => {
	await borrow.get('renew', {
		query: {
			borrowId: id
		}
	})
	ElMessage({
		message: '续借成功',
		type: 'success',
		duration: 1000
	})
	borrowStore.getborrows()
}
</script>
<template>
	<el-container class="book-container">
		<el-main>
			<el-table :data="borrowStore.borrows" style="width: 100%" height="100%">
				<el-table-column fixed prop="book.name" label="书名" width="120" />
				<el-table-column prop="book.number" label="书号" width="120" />
				<el-table-column prop="book.type" label="类别" width="120" />
				<el-table-column prop="book.press" label="出版社" width="120" />
				<el-table-column prop="book.author" label="作者" width="120" />
				<el-table-column prop="book.price" label="价格" width="120" />
				<el-table-column prop="book.time" label="年份" width="120" />
				<el-table-column prop="borrow_s" label="借书日期" width="120" />
				<el-table-column prop="borrow_t" label="应还日期" width="120" />
				<el-table-column fixed="right" label="操作" width="160">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							@click="handleReturn(scope.row.id)"
						>归还</el-button>
						<el-button
							type="primary"
							size="small"
							@click="handleRenew(scope.row.id)"
						>续借</el-button>
					</template>
					
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer class="book-pages">
			<el-pagination
				v-model:current-page="borrowStore.page"
				@current-change="borrowStore.getborrows()"
				:page-size="10"
				:background="true"
				layout="total, prev, pager, next, jumper"
				:total="borrowStore.total"
			/>
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
