<template>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  defineProps({
    label: String
  });
  </script>
  
  <style scoped>
  /* styling khusus wrapper dan label saja */
  </style>
  