<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useUserStore } from '../store/userStore'

const userStore = useUserStore()
const currentPage = ref(1)
const total = ref(100)
const tableData = [
	{
		date: '2016-05-03',
		name: 'Tom',
		state: 'California',
		city: 'Los Angeles',
		address: 'No. 189, Grove St, Los Angeles',
		zip: 'CA 90036',
		tag: 'Home',
	}
]
const handleClick = () => {
	console.log('click')
}
const name = ref("")
const select = ref("")
</script>
<template>
	<el-container class="book-container">
		
		<el-main>
			<el-table :data="tableData" style="width: 100%" height="100%">
				<el-table-column fixed prop="name" label="书名" width="120" />
				<el-table-column prop="number" label="书号" width="120" />
				<el-table-column prop="class" label="类别" width="120" />
				<el-table-column prop="press" label="出版社" width="120" />
				<el-table-column prop="author" label="作者" width="120" />
				<el-table-column prop="price" label="价格" width="120" />
				<el-table-column prop="date" label="归还日期" width="120" />
				<el-table-column fixed="right" label="操作" width="150" >
					<template #default>
						<el-button type="primary" size="small" @click="handleClick">归还</el-button>
						<el-button type="primary" size="small" @click="handleClick">续借</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer class="book-pages">
			<el-pagination
				v-model:currentPage="currentPage"
				:page-size="50"
				:background="true"
				layout="total, prev, pager, next, jumper"
				:total="total"
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
.search-input {
	font-size: 12px;
}
</style>
