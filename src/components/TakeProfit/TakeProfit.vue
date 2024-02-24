<template>
  <div class="bg-base-100 p-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <InfoIcon class="size-4" />
        <span
          class="text-base text-base-600 font-medium"
          :class="{ 'text-base-950' : isTakeProfit }"
        >
          Take Profit
        </span>
      </div>
      <Toggle v-model="isTakeProfit" />
    </div>
    <template v-if="isTakeProfit">
      <TakeProfitTable
        class="mt-4 mb-4"
        :items="store.profitTargets"
        :side="store.activeOrderSide.value"
        @validator="store.addProfitValidator"
      />

      <button
        v-if="canAddProfitTarget"
        class="flex items-center text-eastern-blue-600 mb-4"
        type="button"
        @click="addProfitTargetHandler(NEW_TARGET_AMOUNT)"
      >
        <AddCircleIcon class="mr-2" />
        <span>
        Add profit target {{ store.profitTargets.length }}/{{ MAX_PROFIT_TARGETS }}
      </span>
      </button>

      <div class="flex gap-2">
        <div class="text-sm text-base-600">Projected profit</div>
        <div class="border-dashed border border-base-500 h-px self-end grow"></div>
        <div class="text-base-950">
          {{ projectedProfit }}
          <span class="text-base-600">{{ QUOTE_CURRENCY }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import InfoIcon from '@/shared/icons/InfoIcon/InfoIcon.vue';
import Toggle from '@/shared/components/Toggle/Toggle.vue';
import TakeProfitTable from '@/components/TakeProfit/Table/TakeProfitTable.vue';
import AddCircleIcon from '@/shared/icons/AddCircleIcon/AddCircleIcon.vue';
import {MAX_PROFIT_TARGETS, NEW_TARGET_AMOUNT, QUOTE_CURRENCY} from '@/constants.ts';
import {store} from '@/store';
import type {IProfitTarget} from '@/model.ts';

const isTakeProfit = computed({
  get() {
    return store.isTakeProfit.value
  },
  set(value: boolean) {
    store.setTakeProfit(value)
  }
})

const canAddProfitTarget = computed(() => store.profitTargets.length < MAX_PROFIT_TARGETS)

const projectedProfit = computed(() => {
  const sum = store.profitTargets.reduce((acc: number, cur) => acc + cur.projectProfit, 0)
  return +sum.toFixed(4)
})

watch(isTakeProfit, () => {
  isTakeProfit.value ? addProfitTargetHandler(100) : store.clearProfitTarget()
})

function addProfitTargetHandler(defaultAmount = 20) {
  if (canAddProfitTarget.value) {
    const lastTarget = store.getLastProfitTarget()
    const profit = ref<number>((lastTarget?.profit || 0) + 2)
    const target = ref(store.getTargetPrice(profit.value))
    const amount = ref(defaultAmount)
    const projectProfit = computed(() => {
      const targetAmount = store.amount.value * (amount.value / 100)
      return store.activeOrderSide.value === 'buy' ? targetAmount * (target.value - store.price.value) : targetAmount * (store.price.value - target.value)
    })

    //@ts-ignore
    store.addProfitTarget({ profit, target, amount, projectProfit })

    if (store.amountTotalNum.value > 100) {
      const maxTarget = getMaxProfitAmountTarget()

      if (maxTarget) {
        maxTarget.amount -= store.amountTotalNum.value - 100
      }
    }
  }
}

function getMaxProfitAmountTarget(): IProfitTarget | null {
  if (!store.profitTargets.length) return null

  return store.profitTargets.reduce((max, current) => (current.amount > max.amount ? current : max), store.profitTargets[0]);
}

</script>
