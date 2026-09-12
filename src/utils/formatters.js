export const formatMoney = (amount) => {
  return amount ? amount.toLocaleString('es-CO') : '0'
}

export const formatTicketNumber = (num) => {
  return String(num).padStart(2, '0')
}
