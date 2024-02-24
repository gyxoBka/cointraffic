<template>
  <div class="bg-red-100 border border-red-500 text-red-500 px-3 py-2 relative text-xs font-medium" role="alert">
    <span class="block sm:inline">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  error: string
}

defineProps<IProps>()
</script>
