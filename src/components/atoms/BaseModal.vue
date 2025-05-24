<!-- src\components\atoms\BaseModal.vue -->
<template>
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div :class="`bg-white rounded-xl shadow-lg p-6 w-full ${width}`" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
            <button class="text-gray-500 hover:text-gray-700 text-xl font-bold" @click="$emit('close')">
              &times;
            </button>
          </div>
          <div class="text-sm text-gray-700">
            <slot />
          </div>
          <div class="mt-6 text-right">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  defineProps({
    show: Boolean,
    title: {
      type: String,
      default: 'Konfirmasi',
    },
    width: {
      type: String,
      default: 'max-w-md',
    },
  });
  defineEmits(['close']);
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  