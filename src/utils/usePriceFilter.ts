export const usePriceFilter = (value: number | string, digits = 1, symbol = '') => {
  let number = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(number)) return 0

  const options = {
    minimumFractionDigits: Number.isInteger(number) ? 0 : digits
  }

  const symbolString = `${symbol ? ` ${symbol}` : ''}`

  return `${new Intl.NumberFormat('en-En', options).format(number)}${symbolString}`
}
