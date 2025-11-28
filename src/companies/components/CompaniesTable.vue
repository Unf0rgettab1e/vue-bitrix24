<script lang="ts" setup>
import type { Company } from '@/companies/model/types'

export interface ColumnDef {
  key: string
  title: string
}
defineProps<{ rows: Record<string, Company>[]; columns: ColumnDef[] }>()
</script>

<template>
  <div class="table-container-wrapper">
    <div className="table-container">
      <table class="companies-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.ID">
            <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container-wrapper {
  width: 100%;
  max-width: 100%;
  border: 1px solid #404040;
  border-radius: 12px;
  background: linear-gradient(135deg, #262626 0%, #1c1c1c 100%);
  box-shadow:
    0 4px 20px rgb(0 0 0 / 30%),
    0 2px 8px rgb(0 0 0 / 30%),
    0 0 0 1px #404040;
  overflow-x: auto;
}

.table-container {
  overflow: auto;
  max-height: 70vh;

  scrollbar-color: #787878 transparent;
  scrollbar-width: thin;
}

.companies-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    position: sticky;
    z-index: 10;
    top: 0;
    background-color: #4a4a4a;
  }
}

.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track,
.table-container::-webkit-scrollbar-corner {
  background: transparent;
}

.table-container::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #787878;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #929292;
}

th {
  font-weight: bold;
  font-size: 18px;
}

th,
td {
  border: 1px solid #404040;
  padding: 6px 10px;
}
</style>
