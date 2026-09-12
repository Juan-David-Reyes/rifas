'use client'

import { memo } from 'react'
import { formatTicketNumber } from '../utils/formatters'

const TicketButton = memo(function TicketButton({
  num,
  computedStatus,
  isSelected,
  isDisabled,
  isAdmin,
  isWinner,
  onClick
}) {
  let buttonClasses = "relative overflow-hidden h-14 w-full rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-sm flex justify-center items-center "
  let content = formatTicketNumber(num)

  if (isWinner) {
    buttonClasses += "bg-secondary-500 text-white border-b-4 border-secondary-700 shadow-xl ring-4 ring-secondary-300 scale-105 z-10"
    content = <span className="flex items-center gap-1 text-xl">🏆 {formatTicketNumber(num)}</span>
  } else if (isDisabled && !isWinner && computedStatus === 'disponible') {
    // Only gray out if not winner, and actually disabled (e.g. limit reached or raffle closed)
    buttonClasses += "bg-gray-100 text-gray-400 border border-gray-200 opacity-40 cursor-not-allowed"
  } else {
    if (computedStatus === 'comprado') {
      buttonClasses += `bg-gray-200 text-gray-400 border border-gray-300 opacity-70 ${isAdmin ? 'cursor-pointer hover:border-gray-500 hover:opacity-100 hover:shadow-md' : 'cursor-not-allowed'}`
      content = (
        <>
          <span className="relative z-10">{formatTicketNumber(num)}</span>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform -rotate-45 scale-150 opacity-60"></div>
        </>
      )
    } else if (computedStatus === 'reservado') {
      buttonClasses += `bg-yellow-300 text-yellow-800 border-b-4 border-yellow-500 ${isAdmin ? 'cursor-pointer hover:bg-yellow-400 hover:shadow-md' : 'cursor-not-allowed'}`
    } else {
      if (isSelected) {
        buttonClasses += "bg-primary-600 text-white border-b-4 border-primary-800 shadow-md ring-2 ring-primary-300 ring-offset-2 z-10 scale-105"
      } else {
        if (isDisabled) {
          buttonClasses += "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
        } else {
          buttonClasses += "bg-white text-gray-700 border border-[#777777] hover:border-primary-300 hover:bg-primary-50 hover:shadow-md"
        }
      }
    }
  }

  return (
    <button
      onClick={() => onClick(num)}
      disabled={isDisabled}
      className={buttonClasses}
      title={`Número ${formatTicketNumber(num)} - ${computedStatus}`}
    >
      {content}
    </button>
  )
})

export default TicketButton
