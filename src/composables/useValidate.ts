import {reactive} from 'vue';
import {normalizeValidator} from '@/utils/validator/helpers';
import type {UnwrapNestedRefs} from '@vue/reactivity';

export interface IValidator {
  $message: string
  $validator: (param: string) => boolean
}

export interface IValidateFormItem {
  $invalid: boolean
  $error: string
  $touch: (silent?: boolean) => void
  $reset: () => void
  $validators: any
}

export type FormValidator = (silent?: boolean) => boolean

export interface IValidateForm {
  [key: string]: IValidateFormItem;
  // @ts-ignore
  $validate: FormValidator
  // @ts-ignore
  $reset: () => void
}

export const useValidate = <T>(rules: any, data: UnwrapNestedRefs<T>) => {
  const form = {} as IValidateForm
  const rulesKeys = Object.keys(rules)

  form.$validate = function (silent = false) {
    let isValid = true
    rulesKeys.forEach(ruleKey => {
      form[ruleKey].$touch(silent)

      if (isValid) {
        isValid = !form[ruleKey].$invalid
      }
    })

    return isValid
  }
  form.$reset = function () {
    rulesKeys.forEach(ruleKey => {
      form[ruleKey].$reset()
    })
  }

  rulesKeys.forEach((key: string) => {
    form[key] = reactive<IValidateFormItem>({
      $invalid: false,
      $error: '',
      $validators: rules[key],
      $reset: function () {
        this.$invalid = false
        this.$error = ''
      },
      $touch: function (silent = false) {
        this.$validators.some((item: any) => {
          const { $validator, $message } = normalizeValidator(item)

          // @ts-ignore
          this.$invalid = !$validator(data[key])
          if (!silent) {
            this.$error = this.$invalid ? $message : ''
          }

          return this.$invalid
        })
      },
    })
  })

  return { form }
}
