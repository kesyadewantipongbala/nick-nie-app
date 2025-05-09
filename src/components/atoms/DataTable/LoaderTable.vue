<script setup>
  import { ref } from 'vue';
  import { ClipLoader } from 'vue-spinner';
  import { joinClass } from '../../../utils/common';

  const props = defineProps({
    position: {
      type: String,
      default: 'fixed',
    },
    className: String,
    text: String,
    loading: {
      type: Boolean,
      required: true,
    },
  });
</script>

<template>
  <div
    :class="
      joinClass(
        'left-0 right-0 top-0 bottom-0 bg-gray-300/50 z-10',
        props.position,
        props.className
      )
    "
  >
    <div class="flex flex-col items-center justify-center h-full">
      <ClipLoader
        color="#FFFFFF"
        :loading="props.loading"
        :size="150"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span class="animate-bounce text-4xl text-white font-bold mt-10">{{ props.text }}</span>
    </div>
  </div>
</template>
