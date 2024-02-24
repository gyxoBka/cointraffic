import type {IValidator} from '@/composables/useValidate';

export interface IValidatorOptions {
  dirty?: boolean
}

export function isFunction (val: any) {
  return typeof val === 'function'
}

export function normalizeValidator(validator: any): IValidator {
  return isFunction(validator)
    ? { $validator: validator }
    : { ...validator }
}

export function withMessage($message: string, $validator: any) {
  const validatorObj = normalizeValidator($validator)
  validatorObj.$message = $message

  return validatorObj
}

export function minValue(num: number) {
  return function (value: number): boolean {
    return value >= num
  }
}

export function minValueStrict(num: number) {
  return function (value: number): boolean {
    return value > num
  }
}

export function isNumber(value: any) {
  return typeof value === 'number'
}

