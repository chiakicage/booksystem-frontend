<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useBookStore } from '../store/bookStore'
const name = ref('')
const bookStore = useBookStore()

const clearFilter = () => {
	bookStore.$patch({
			filter: {
				press: '',
				name: '',
				type: '',
				number: '',
				author: '',
				time: ['', ''],
				price: ['', '']
			}
		})
}
const submitFilter = () => {

}
</script>
<template>
	<el-row justify="space-between" :align="'middle'" style="height: 50%; font-size: 12px;">
		<el-col :span="1">书名：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.name" class="search-input" />
		</el-col>
		<el-col :span="1">书号：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.number" class="search-input" />
		</el-col>
		<el-col :span="1">类别：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.type" class="search-input" />
		</el-col>
		<el-col :span="1">作者：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.author" class="search-input" />
		</el-col>
		<el-col :span="2">出版社：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.press" class="search-input" />
		</el-col>
	</el-row>
	<el-row justify="space-between" :align="'middle'" style="height: 50%; font-size: 12px;">
		<el-col :span="2" style="display: flex; flex-direction: row; justify-content: flex-start;">价格范围：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.price[0]" class="search-input" />
		</el-col>
		<el-col :span="1">~</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.price[1]" class="search-input" />
		</el-col>
		<el-col :span="2" style="display: flex; flex-direction: row; justify-content: flex-start;">年份范围：</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.time[0]" />
		</el-col>
		<el-col :span="1">~</el-col>
		<el-col :span="3">
			<el-input v-model="bookStore.filter.time[1]" />
		</el-col>
		<el-col :span="3" style="display: flex; flex-direction: row; justify-content: flex-end;">
		<el-button-group>
			<el-button type="primary" style="width: 50%" @click="clearFilter">
				清空
			</el-button>
			<el-button type="primary" style="width: 50%" @click="bookStore.getbooks()">
				筛选
				<!-- <el-icon style="margin-left: 5px;">
					<Search />
				</el-icon> -->
			</el-button>
		</el-button-group>
		</el-col>
	</el-row>
</template>
<style>
.search-input {
	font-size: 12px;
}
</style>
