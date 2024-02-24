export interface IFormValidator {
  isValid: boolean
  error: string
}

export type ValidatorFunction = () => IFormValidator

export function useFormValidate(validators: ValidatorFunction[]) {
  const errors: string[] = []
  let isValidForm = true

  validators.forEach(validator => {
    const { isValid, error } = validator()

    if (!isValid) {
      isValidForm = false

      error && errors.push(error)
    }
  })

  return { isValid: isValidForm, errors }
}
