<script lang="ts" setup>
import { ref, computed } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import ProgressBar from '@/shared/ui/ProgressBar.vue'
import CompaniesTable, { type ColumnDef } from './CompaniesTable.vue'
import { useCompaniesStore } from '../model/companies.store'
import { useCompaniesService } from '../model/useCompaniesService'
import PaginationView from '../../shared/ui/PaginationView.vue'

const store = useCompaniesStore()
const { loadAllCompaniesAsync, loadAllCompaniesSync, clearCompanies } = useCompaniesService()
const page = ref(1),
  pageSize = 50
const clearWithDB = ref(false),
  isAsync = ref(false)
const columns: ColumnDef[] = [
  { key: 'ID', title: 'ID' },
  { key: 'TITLE', title: 'Title' },
  { key: 'INDUSTRY', title: 'Industry' },
  { key: 'COMPANY_TYPE', title: 'Type' },
  { key: 'LAST_ACTIVITY_TIME', title: 'Last activity' },
]

function loadCompaniesHandler() {
  ;(isAsync.value ? loadAllCompaniesAsync : loadAllCompaniesSync)()

  page.value = 1
}

function clearCompaniesHandler() {
  clearCompanies(clearWithDB.value)
  page.value = 1
}

const pagedCompanies = computed(() => {
  const start = (page.value - 1) * pageSize
  return store.companies.slice(start, start + pageSize)
})
</script>

<template>
  <div class="companies-page">
    <div class="header">
      <h1>Bitrix24 CRM Companies</h1>
      <div v-if="store.isLoading">Loading...</div>
      <div v-else-if="store.total">{{ (store.timeRequest / 1000).toFixed(2) }} sec</div>
    </div>
    <div class="controls">
      <BaseButton :disabled="store.isLoading" @click="loadCompaniesHandler">Load all</BaseButton>
      <label for="use-async"
        ><input type="checkbox" id="use-async" v-model="isAsync" /> Async</label
      >
      <div v-if="store.progress > 0" class="progress-wrapper">
        <ProgressBar :percent="store.progress" />
      </div>
      <div>Loaded: {{ store.companies.length }}/{{ store.total }}</div>
      <BaseButton
        v-if="store.total"
        bg="#ff4141"
        :disabled="store.total === 0"
        @click="clearCompaniesHandler"
        >Clear</BaseButton
      >
      <label v-if="store.total" for="use-db"
        ><input type="checkbox" id="use-db" v-model="clearWithDB" /> Also clear IndexedDB</label
      >
    </div>
    <CompaniesTable v-if="store.total" :rows="pagedCompanies" :columns="columns" />
    <PaginationView
      v-if="store.total"
      :page="page - 1"
      :total="store.total"
      :pageSize="pageSize"
      :onChange="(newPage: number) => (page = newPage + 1)"
    />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.companies-page {
  padding: 20px;
  font-family: sans-serif;
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.progress-wrapper {
  width: 300px;
}

.pagination {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
