<template>
  <div class="overflow-x-auto">
    <div class="max-h-[500px] overflow-y-auto">
      <table class="min-w-full divide-y divide-gray-200 table-fixed">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="toggleSort(col.key)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer select-none"
            >
              <div class="flex items-center gap-1">
                <span>{{ col.label }}</span>
                <span v-if="sortKey === col.key">
                  <span v-if="sortOrder === 'asc'">▲</span>
                  <span v-else>▼</span>
                </span>
              </div>
            </th>
            <th class="px-6 py-3 bg-gray-50"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in sortedRows" :key="row.id" class="hover:bg-gray-100">
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <span v-if="isDateKey(col.key)">
                {{ formatDate(row[col.key]) }}
              </span>
              <span v-else>
                {{ row[col.key] }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';

  const props = defineProps({
    columns: Array,
    rows: Array,
  });

  const sortKey = ref(null);
  const sortOrder = ref('asc');

  function toggleSort(key) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  }

  function isDateKey(key) {
    return key === 'created_at' || key === 'updated_at';
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  const sortedRows = computed(() => {
    if (!sortKey.value) return props.rows;

    return [...props.rows].sort((a, b) => {
      const valA = a[sortKey.value];
      const valB = b[sortKey.value];

      // Date comparison
      if (isDateKey(sortKey.value)) {
        return sortOrder.value === 'asc'
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      // String/number comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder.value === 'asc' ? valA - valB : valB - valA;
      }

      return sortOrder.value === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  });
</script>
