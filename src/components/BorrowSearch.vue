<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../store/userStore'
import { useBorrowStore } from '../store/borrowStore'

const userStore = useUserStore()
const borrowStore = useBorrowStore()

const handleClick = () => {
	console.log('click')
}
</script>
<template>
	<el-container class="book-container">
		<el-main>
			<el-table :data="borrowStore.borrows" style="width: 100%" height="100%">
				<el-table-column fixed prop="name" label="书名" width="120" />
				<el-table-column prop="number" label="书号" width="120" />
				<el-table-column prop="type" label="类别" width="120" />
				<el-table-column prop="press" label="出版社" width="120" />
				<el-table-column prop="author" label="作者" width="120" />
				<el-table-column prop="price" label="价格" width="120" />
				<el-table-column prop="borrow_time" label="借书日期" width="120" />
				<el-table-column prop="return_time" label="归还日期" width="120" />
				<el-table-column fixed="right" label="操作" width="80">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							@click="handleClick"
						>归还</el-button>
					</template>
					
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer class="book-pages">
			<el-pagination
				v-model:current-page="borrowStore.page"
				@current-change="borrowStore.getborrows()"
				:page-size="50"
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
