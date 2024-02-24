import type {FormValidator} from '@/composables/useValidate.ts';

export type OrderSide = "buy" | "sell";

export interface IProfitTarget {
  id: number
  profit: number
  amount: number
  target: number
  projectProfit: number
  validate?: FormValidator
}

export interface ITableItemValidator {
  id: number
  validate: FormValidator
}
