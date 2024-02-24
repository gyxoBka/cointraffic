<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import NumberInput from "@/shared/components/NumberInput/NumberInput.vue";
import InfoIcon from "@/shared/icons/InfoIcon/InfoIcon.vue";
import TakeProfit from "@/components/TakeProfit/TakeProfit.vue";
import Button from "@/shared/components/Button/Button.vue";
import PlaceOrderTypeSwitch from "@/components/PlaceOrderTypeSwitch.vue";
import Alert from '@/shared/components/Alert/Alert.vue';
import {BASE_CURRENCY, MAX_PROFIT_NUM, QUOTE_CURRENCY} from "@/constants.ts";
import {store} from "@/store";
import {usePriceFilter} from '@/utils/usePriceFilter.ts';
import {useValidate} from '@/composables/useValidate.ts';
import {isNumber, withMessage} from '@/utils/validator/helpers.ts';
import {useFormValidate} from '@/utils/useFormValidate.ts';
import type {IProfitTarget} from '@/model.ts';
import type {IFormValidator, ValidatorFunction} from '@/utils/useFormValidate.ts';

const submitButtonText = computed(() => {
  return store.activeOrderSide.value === "buy"
    ? `Buy ${BASE_CURRENCY}`
    : `Sell ${QUOTE_CURRENCY}`;
});

const formErrors = ref<string[]>([])

const isPriceFocus = ref(false)
const isAmountFocus = ref(false)
const isTotalFocus = ref(false)

const isPureValue = ref(false)

const priceValue = computed({
  get() {
    if (isPriceFocus.value || isPureValue.value) {
      return +store.price.value
    }

    return usePriceFilter(store.price.value)
  },
  set(newValue) {
    store.setPrice(parseFloat(`${newValue}`) || 0)
  }
})
const amountValue = computed({
  get() {
    if (isAmountFocus.value || isPureValue.value) {
      return +store.amount.value
    }

    return usePriceFilter(store.amount.value)
  },
  set(newValue) {
    store.setAmount(parseFloat(`${newValue}`) || 0)
  }
})
const totalValue = computed({
  get() {
    if (isTotalFocus.value || isPureValue.value) {
      return +store.total.value
    }

    return usePriceFilter(store.total.value)
  },
  set(newValue) {
    store.setTotal(parseFloat(`${newValue}`) || 0)
  }
})

const formData = reactive({
  price: priceValue,
  amount: amountValue,
  total: totalValue,
});

const rules = {
  price: [ withMessage('Price should be a number', isNumber) ],
  amount: [ withMessage('Amount should be a number', isNumber) ],
  total: [ withMessage('Total should be a number', isNumber) ],
}

const v$ = useValidate(rules, formData);

function formValidator(): ValidatorFunction {
  return function (): IFormValidator {
    return {
      isValid: v$.form.$validate(),
      error: '',
    }
  }
}

function validateTargets(): IFormValidator {
  return {
    isValid: store.profitTargets.reduce((acc: boolean, cur: IProfitTarget) => {
      if (!cur.validate) {
        return false
      }

      const isValid = cur.validate()

      return acc && isValid
    }, true),
    error: '',
  }
}

function validateProfitIncrement(): IFormValidator {
  return {
    isValid: store.profitTargets.every((value, index, array) => {
      return index !== 0 ? value > array[index - 1] : true
    }),
    error: "Each target's profit should be greater than the previous one",
  }
}

function validateMaxProfitNum(): IFormValidator {
  return {
    isValid: store.profitTotalNum.value <= MAX_PROFIT_NUM,
    error: `Maximum profit sum is ${MAX_PROFIT_NUM}%`,
  }
}

function validateAmountMoreThan(num: number): ValidatorFunction {
  return function (): IFormValidator {
    const totalAmount = store.profitTargets.reduce((acc, item) => acc + item.amount, 0);

    const isValid = totalAmount <= num
    let error = ''

    if (!isValid) {
      error = `${totalAmount}% out of ${num}% selected. Please decrease by ${totalAmount - num}`;
    }

    return { isValid, error }
  }
}

function validateAmountLessThan(num: number): ValidatorFunction {
  return function (): IFormValidator {
    const totalAmount = store.profitTargets.reduce((acc, item) => acc + item.amount, 0);

    const isValid = totalAmount >= num
    let error = ''

    if (!isValid) {
      error = `${totalAmount}% out of ${num}% selected. Please increase by ${num - totalAmount}`;
    }

    return { isValid, error }
  }
}

const onSubmit = () => {
  isPureValue.value = true

  const validators = [ formValidator() ]

  if (store.isTakeProfit.value) {
    validators.push(
      validateTargets,
      validateProfitIncrement,
      validateMaxProfitNum,
      validateAmountMoreThan(100),
      validateAmountLessThan(100),
    )
  }

 const { isValid, errors } = useFormValidate(validators)

  isPureValue.value = false
  formErrors.value = errors

  if (!isValid) return;

  console.log("submit. Call the API");
}

</script>

<template>
  <form @submit.prevent="onSubmit" class="grid gap-4">
    <div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-base-600">Market direction</span>
        <InfoIcon class="size-4" />
      </div>

      <PlaceOrderTypeSwitch
        class="mt-2"
        :modelValue="store.activeOrderSide.value"
        @update:modelValue="store.setOrderSide($event)"
      />
    </div>
    <NumberInput
      id="price"
      v-model="priceValue"
      :label="`Price, ${QUOTE_CURRENCY}`"
      @focus="isPriceFocus = true"
      @blur="isPriceFocus = false"
      autofocus
    />
    <NumberInput
      id="amount"
      v-model="amountValue"
      :label="`Amount, ${BASE_CURRENCY}`"
      @focus="isAmountFocus = true"
      @blur="isAmountFocus = false"
    />
    <NumberInput
      id="total"
      :label="`Total, ${QUOTE_CURRENCY}`"
      v-model="totalValue"
      @focus="isTotalFocus = true"
      @blur="isTotalFocus = false"
    />

    <TakeProfit />

    <Alert v-for="(error, index) in formErrors" :key="index" :error="error" />

    <Button type="submit" variant="accent" :full-width="true">
      {{ submitButtonText }}
    </Button>
  </form>
</template>
