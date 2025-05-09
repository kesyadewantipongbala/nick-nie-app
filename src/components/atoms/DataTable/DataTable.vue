<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import {
    flexRender,
    useVueTable,
    getCoreRowModel,
    getGroupedRowModel,
  } from '@tanstack/vue-table';
  import _ from 'lodash';
  import LoaderTable from './LoaderTable.vue';
  import { joinClass } from '../../../utils/common';

  const props = defineProps({
    columns: Array,
    data: Array,
    loading: Boolean,
    pagination: Object,
    callback: Function,
  });

  const emit = defineEmits(['update:page']);

  const table = useVueTable({
    data: props.data || [],
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  const headerCustom = computed(() => {
    const headerGroups = table.getHeaderGroups();
    if (headerGroups.length > 1) {
      const tempColumns = [];
      const columns = table.getAllColumns().map((column) => {
        if (column.columns?.length > 0) {
          tempColumns.push(...column.columns);
          return column;
        }
        return { ...column, rowSpan: 2 };
      });
      if (tempColumns.length > 0) {
        columns.push(...tempColumns);
      }

      const headers = [...headerGroups];
      const result = columns.map((column) => {
        let find = false;
        let headerFind;
        headers.forEach((header) => {
          if (find) return;
          headerFind = header.headers.find((head) => head.column.id === column.id);
          if (headerFind) find = true;
        });
        return { ...headerFind, rowSpan: column?.rowSpan ?? headerFind?.rowSpan };
      });

      const group = _.groupBy(result, 'depth');
      return Object.keys(group).map((key, i) => ({ id: String(i), depth: i, headers: group[key] }));
    }
    return headerGroups;
  });
</script>

<template>
  <div
    :class="
      joinClass('overflow-y-inherit overflow-x-auto relative', loading ? 'min-h-[500px]' : '')
    "
  >
    <LoaderTable v-if="loading" position="absolute" text="Loading..." :loading="true" />

    <table class="table w-full overflow-inherit border rounded-xl">
      <thead>
        <tr v-for="headerGroup in headerCustom" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colspan="header.colSpan"
            :rowspan="header.rowSpan || 1"
            class="bg-[#fcfcfc] text-black text-center text-base border"
          >
            {{ flexRender(header.column.columnDef.header, header.getContext()) }}
          </th>
        </tr>
      </thead>

      <tbody v-if="data?.length > 0">
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="text-center border">
            {{ flexRender(cell.column.columnDef.cell, cell.getContext()) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="pagination && data?.length > 0" class="mt-8 flex justify-end pagination">
      <v-pagination
        v-model="pagination.PAGE"
        :length="pagination.LAST_PAGE"
        color="primary"
        size="large"
        @input="(value) => callback(value)"
      />
    </div>

    <div v-if="(!data || data.length === 0) && !loading" class="text-center px-8 py-40">
      <h6 class="font-semibold text-gray-500">Data tidak ditemukan</h6>
    </div>
  </div>
</template>
