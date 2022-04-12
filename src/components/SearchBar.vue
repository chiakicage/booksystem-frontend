<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useBookStore } from '../store/bookStore'
const name = ref('')
const bookStore = useBookStore()


const price_s = ref('')
const price_t = ref('')
const time_s = ref('')
const time_t = ref('')

watch(price_s, (val, oldval) => {
	if (isNaN(Number(val))) price_s.value = oldval
	else bookStore.filter.price[0] = price_s.value
})
watch(price_t, (val, oldval) => {
	if (isNaN(Number(val))) price_t.value = oldval
	else bookStore.filter.price[1] = price_t.value
})
watch(time_s, (val, oldval) => {
	if (isNaN(Number(val))) time_s.value = oldval
	else bookStore.filter.time[0] = time_s.value
})
watch(time_t, (val, oldval) => {
	if (isNaN(Number(val))) time_t.value = oldval
	else bookStore.filter.time[1] = time_t.value
})
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
	price_s.value = ''
	price_t.value = ''
	time_s.value = ''
	time_t.value = ''
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
			<el-input v-model="price_s" class="search-input" />
		</el-col>
		<el-col :span="1">~</el-col>
		<el-col :span="3">
			<el-input v-model="price_t" class="search-input" />
		</el-col>
		<el-col :span="2" style="display: flex; flex-direction: row; justify-content: flex-start;">年份范围：</el-col>
		<el-col :span="3">
			<el-input v-model="time_s" class="search-input" />
		</el-col>
		<el-col :span="1">~</el-col>
		<el-col :span="3">
			<el-input v-model="time_t" class="search-input" />
		</el-col>
		<el-col :span="3" style="display: flex; flex-direction: row; justify-content: flex-end;">
		<el-button-group>
			<el-button style="width: 50%" @click="clearFilter">
				清空
			</el-button>
			<el-button style="width: 50%" @click="bookStore.getbooks()">
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
