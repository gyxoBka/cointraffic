<template>
  <div class="w-full">
    <div class="flex items-center font-medium text-xs text-base-600">
      <div class="w-3/12">Profit</div>
      <div class="w-5/12">Target price</div>
      <div class="w-4/12">Amount to {{ side }}</div>
    </div>
    <div>
      <TakeProfitTableItem v-for="item in items" :key="item.id" :item="item" @validator="onSetValidatorHandler" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TakeProfitTableItem from '@/components/TakeProfit/Table/TakeProfitTableItem.vue';
import type {IProfitTarget, ITableItemValidator, OrderSide} from '@/model.ts';

interface IProps {
  items: IProfitTarget[]
  side: OrderSide
}

defineProps<IProps>()

const emit = defineEmits(['validator']);

function onSetValidatorHandler(validator: ITableItemValidator) {
  emit('validator', validator)
}
</script>
