<script setup lang="ts">
import {ref} from 'vue';

defineOptions({
  inheritAttrs: false,
});

defineProps({
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  labelInline: {
    type: Boolean,
    default: false,
  },
  wrapperClass: {
    type: String,
    default: 'px-3 pb-1.5 pt-2.5',
  },
  labelClass: {
    type: String,
    default: 'text-base-600',
  },
  modelValue: {
    type: [Number, String],
    default: NaN,
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputEl = ref<HTMLElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", parseFloat(target.innerText));
};

function onClickHandler() {
  if (inputEl) {
    inputEl.value?.focus()
  }
}

</script>

<template>
  <div
    class="group bg-base-100 focus-within:bg-base-200 hover:bg-base-200"
    :class="[{ 'flex' : labelInline }, wrapperClass]"
    @click="onClickHandler"
  >
    <label v-if="label" class="block text-sm" :class="[{ 'order-1 ml-1' : labelInline }, labelClass]">
      {{ label }}
    </label>

    <span
      ref="inputEl"
      class="block border-0 bg-base-100 p-0 placeholder:text-gray-400 focus:bg-base-200 focus:outline-none group-hover:bg-base-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      contenteditable
      inputmode="numeric"
      v-bind="$attrs"
      @input="handleInput"
    >
      {{ modelValue }}
    </span>
  </div>
</template>
