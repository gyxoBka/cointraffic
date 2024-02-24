import {computed, reactive, ref} from 'vue'
import type {IProfitTarget, ITableItemValidator, OrderSide} from "@/model.ts";

const useStore = () => {
  const activeOrderSide = ref<OrderSide>('buy')
  const price = ref<number>(2)
  const amount = ref<number>(0)
  const isTakeProfit = ref<boolean>(false)

  const profitTargets = reactive<IProfitTarget[]>([])

  const total = computed(() => price.value * amount.value)
  const amountTotalNum = computed(() => {
    return profitTargets.reduce((acc: number, cur) => {
      return acc + cur.amount
    }, 0)
  })
  const profitTotalNum = computed(() => {
    return profitTargets.reduce((acc: number, cur) => {
      return acc + cur.profit
    }, 0)
  })

  function setOrderSide(side: OrderSide): void {
    activeOrderSide.value = side

    updateProfitTargets()
  }
  function setPrice(value: number): void {
    price.value = value
  }
  function setAmount(value: number): void {
    amount.value = value
  }
  function setTotal(value: number): void {
    amount.value = price.value > 0 ? value / price.value : 0
  }
  function setTakeProfit(value: boolean): void {
    isTakeProfit.value = value
  }
  function addProfitTarget(target: Omit<IProfitTarget, 'id'>): IProfitTarget {
    const item: IProfitTarget = {
      ...target,
      id: profitTargets.length,
    }

    profitTargets.push(item)

    return item
  }
  function removeProfitTarget(id: number): void {
    const targetIndex = profitTargets.findIndex(item => item.id === id)
    targetIndex !== -1 && profitTargets.splice(targetIndex, 1)
  }
  function clearProfitTarget(): void {
    profitTargets.splice(0, profitTargets.length)
  }
  function getLastProfitTarget(): IProfitTarget | null {
    if (!profitTargets.length) return null

    return profitTargets[profitTargets.length - 1]
  }
  function getTargetPrice(profit: number): number {
    return activeOrderSide.value === 'buy' ? price.value * (1 + profit / 100) : price.value * (1 - profit / 100)
  }
  function getTargetProfit(targetPrice: number): number {
    return (targetPrice / price.value * 100) - 100
  }
  function updateProfitTargets(): void {
    profitTargets.forEach(item => {
      item.target = store.getTargetPrice(item.profit)
    })
  }
  function findTargetById(id: number): IProfitTarget | undefined {
    return profitTargets.find((item: IProfitTarget) => item.id === id)
  }
  function addProfitValidator({ id, validate }: ITableItemValidator) {
    const target = findTargetById(id)

    if (!target) return

    target.validate = validate
  }

  return {
    activeOrderSide,
    price,
    amount,
    isTakeProfit,
    profitTargets,
    total,
    amountTotalNum,
    profitTotalNum,
    setOrderSide,
    setPrice,
    setAmount,
    setTotal,
    setTakeProfit,
    addProfitTarget,
    removeProfitTarget,
    clearProfitTarget,
    getLastProfitTarget,
    getTargetPrice,
    getTargetProfit,
    addProfitValidator,
    findTargetById,
  }
}
export const store= useStore()
