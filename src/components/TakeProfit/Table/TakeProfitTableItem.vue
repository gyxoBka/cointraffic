<template>
  <div>
    <div
      class="flex border-b border-base-400 pb-1 pt-3 text-sm"
      :class="{ 'border-red-400 text-red-600' : isFormInvalid }"
    >
      <div class="w-3/12 pr-1 overflow-hidden">
        <EditableInput
          class="min-w-2 max-w-11 overflow-hidden"
          :class="isFormInvalid ? 'text-red-600' : 'text-base-950'"
          :labelClass="isFormInvalid ? 'text-red-600' : 'text-base-600'"
          wrapper-class="p-0 input-wrapper flex items-center"
          id="profit"
          label="%"
          label-inline
          :modelValue="item.profit"
          @update:modelValue="onProfitUpdate"
          @blur="onProfitBlur"
        />
      </div>
      <div class="w-5/12 pr-1 overflow-hidden">
        <EditableInput
          class="min-w-12 max-w-24 overflow-hidden"
          :class="isFormInvalid ? 'text-red-600' : 'text-base-950'"
          :labelClass="isFormInvalid ? 'text-red-600' : 'text-base-600'"
          wrapper-class="p-0 flex items-center"
          id="target"
          :label="QUOTE_CURRENCY"
          label-inline
          :modelValue="targetValue"
          @update:modelValue="onTargetUpdate"
          @focus="onTargetFocus"
          @blur="onTargetBlur"
        />
      </div>
      <div class="w-4/12 flex justify-between">
        <EditableInput
          class="min-w-2 max-w-7 overflow-hidden"
          :class="isFormInvalid ? 'text-red-600' : 'text-base-950'"
          :labelClass="isFormInvalid ? 'text-red-600' : 'text-base-600'"
          wrapper-class="p-0 input-wrapper flex items-center"
          id="baseAmount"
          label="%"
          label-inline
          :model-value="item.amount"
          @update:modelValue="onAmountUpdate"
          @blur="onAmountBlur"
        />
        <CloseIconButton @click="store.removeProfitTarget(item.id)" />
      </div>
    </div>

    <Alert v-if="v$.form.target.$invalid" :error="v$.form.target.$error" class="mt-3" />
    <Alert v-if="v$.form.profit.$invalid" :error="v$.form.profit.$error" class="mt-3" />
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref} from 'vue';
import EditableInput from '@/shared/components/EditableInput/EditableInput.vue';
import CloseIconButton from '@/shared/icons/CloseIcon/CloseIconButton.vue';
import Alert from '@/shared/components/Alert/Alert.vue';
import {store} from '@/store';
import {MIN_PROFIT_VALUE, QUOTE_CURRENCY} from '@/constants.ts';
import {usePriceFilter} from '@/utils/usePriceFilter.ts';
import {minValue, minValueStrict, withMessage} from '@/utils/validator/helpers.ts';
import {useValidate} from '@/composables/useValidate.ts';
import type {IProfitTarget} from '@/model.ts';

interface IProps {
  item: IProfitTarget
}

const props = defineProps<IProps>()
const emit = defineEmits(['validator']);

const isTargetFocus = ref(false)
const isPureValue = ref(false)

const targetValue = computed(() => {
  if (isTargetFocus.value || isPureValue.value) {
    return props.item.target
  }

  return usePriceFilter(props.item.target)
})

const formData = reactive({
  profit: props.item.profit,
  target: props.item.target,
  amount: props.item.amount,
});

const rules = {
  profit: [
    withMessage(`Minimum value is ${MIN_PROFIT_VALUE}%`, minValue(MIN_PROFIT_VALUE)),
  ],
  target: [
    withMessage(`Price must be greater than 0`, minValueStrict(0)),
  ],
}

const v$ = useValidate(rules, formData);

const isFormInvalid = computed(() => v$.form.profit.$error || v$.form.target.$error)

function onProfitUpdate(value: number) {
  formData.profit = value
}
function onProfitBlur() {
  props.item.profit = formData.profit
  props.item.target = store.getTargetPrice(formData.profit)
}

function onTargetUpdate(value: number) {
  formData.target = value
}
function onTargetBlur() {
  props.item.target = formData.target
  props.item.profit = store.getTargetProfit(formData.target)
  isTargetFocus.value = false
}
function onTargetFocus() {
  isTargetFocus.value = true
}

function onAmountUpdate(value: number) {
  formData.amount = value
}
function onAmountBlur() {
  props.item.amount = formData.amount
}

onBeforeMount(() => {
  emit('validator', { id: props.item.id, validate: v$.form.$validate })
})
</script>

<style scoped>
.input-wrapper {
  width: max-content;
}
</style>
