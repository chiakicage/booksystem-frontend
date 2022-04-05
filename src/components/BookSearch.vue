<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from './SearchBar.vue';
import { useUserStore } from '../store/userStore'
import { useBookStore } from '../store/bookStore'

const userStore = useUserStore()
const bookStore = useBookStore()

const handleClick = () => {
	console.log('click')
}
</script>
<template>
	<el-container class="book-container">
		<el-header height="80px">
			<SearchBar></SearchBar>
		</el-header>
		<el-main>
			<el-table :data="bookStore.books" style="width: 100%" height="100%">
				<el-table-column fixed prop="name" label="书名" width="120" />
				<el-table-column prop="number" label="书号" width="120" />
				<el-table-column prop="type" label="类别" width="120" />
				<el-table-column prop="press" label="出版社" width="120" />
				<el-table-column prop="author" label="作者" width="120" />
				<el-table-column prop="price" label="价格" width="120" />
				<el-table-column prop="stock" label="库存" width="120" />
				<el-table-column fixed="right" label="操作" width="80">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							@click="handleClick"
							:disabled="!userStore.logined || scope.row.stock == 0"
						>借阅</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer class="book-pages">
			<el-pagination
				v-model:current-page="bookStore.page"
				@current-change="bookStore.getbooks()"
				:page-size="50"
				:background="true"
				layout="total, prev, pager, next, jumper"
				:total="bookStore.total"
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
