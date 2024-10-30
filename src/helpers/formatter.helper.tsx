// @ts-nocheck
export const moneyFormatter = (value = 0, isUseCurrencySign = true) => {
  if (value === null) {
    return 0
  }
  const currentValue = value.toString()
  const [money, decimal] = currentValue.split('.')
  const replacer = (val: string) =>
    val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  if (decimal && parseInt(decimal, 10) !== 0) {
    const convertDecimal = Number.parseFloat(`0.${decimal}`)
      .toFixed(2)
      .toString()
      .substring(2)
    return `${replacer(money)},${convertDecimal}`
  }
  if (currentValue.includes('-')) {
    return `-${replacer(money)}`
  }

  return `${isUseCurrencySign ? 'Rp ' : ''}${replacer(money)}`
}

export const currencyInputFormatter = (value: string, currency: string) => {
  return `${currency} ${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const currencyInputParser = (value: string, currency: string) => {
  return value.replace(new RegExp(`${currency}\\s?|(,*)`, 'g'), '')
}

export const capitalizeTextFormatter = (value: string) => {
  const str = value
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substr(0, maxLength) + '...'
  }
  return str
}

export const currencyFloatConverter = (value: string) => {
  return parseFloat(value).toFixed(2)
}

export const formatBytes = (
  bytes: number,
  decimals: number = 2,
): { value: number; unit: string; unitIndex: number } | string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i],
    unitIndex: i,
  }
}

export const cleanStringFormatter = (text: string, separator: string) => {
  // Define a regular expression that matches '_', '-', '.', and ','
  var regex = /[_\-.']/g

  // Use the replace method to remove the matched characters
  var cleanedText = text.replace(regex, separator)

  return cleanedText
}
