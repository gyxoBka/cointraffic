<template>
  <label class="inline-flex items-center cursor-pointer">
    <input type="checkbox" class="sr-only peer" v-model="state">
    <div class="relative w-11 h-6 bg-base-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-eastern-blue-300 dark:peer-focus:ring-eastern-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-[110%] rtl:peer-checked:after:-translate-x-[-110%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all dark:border-gray-600 peer-checked:bg-eastern-blue-600"></div>
  </label>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const state = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  }
})
</script>
