<script setup lang="ts">
import {computed} from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  modelValue: {
    type: [Number, String],
    default: NaN,
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emit('update:modelValue', value)
  }
})

</script>

<template>
  <div
    class="group bg-base-100 px-3 pb-1.5 pt-2.5 focus-within:bg-base-200 hover:bg-base-200"
  >
    <label v-if="label" :for="id" class="block text-sm text-base-600">
      {{ label }}
    </label>

    <input
      :id="id"
      class="block w-full border-0 bg-base-100 p-0 text-base-950 placeholder:text-gray-400 focus:bg-base-200 focus:outline-none group-hover:bg-base-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      v-bind="$attrs"
      v-model="inputValue"
    />
  </div>
</template>
