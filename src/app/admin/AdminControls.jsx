'use client'

import { useState } from 'react'
import { Ban, PauseCircle, PlayCircle } from 'lucide-react'
import { toggleRaffleStatus, banUserAction } from '../../utils/superAdminActions'

export function RaffleStatusButton({ raffleId, currentStatus }) {
  const [isLoading, setIsLoading] = useState(false)
  const isPaused = currentStatus === 'PAUSED'

  const handleToggle = async () => {
    if (!window.confirm(`¿Estás seguro de ${isPaused ? 'ACTIVAR' : 'PAUSAR'} esta rifa?`)) return
    
    setIsLoading(true)
    try {
      await toggleRaffleStatus(raffleId, isPaused ? 'ACTIVE' : 'PAUSED')
    } catch (err) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
        isPaused 
          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200' 
          : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
      }`}
    >
      {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
      {isPaused ? 'Reactivar' : 'Pausar'}
    </button>
  )
}

export function BanUserButton({ userId, isBanned }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBan = async () => {
    if (!window.confirm(`¿Estás seguro de ${isBanned ? 'DESBANEAR' : 'BANEAR'} a este organizador?`)) return
    
    setIsLoading(true)
    try {
      await banUserAction(userId, !isBanned)
    } catch (err) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleBan}
      disabled={isLoading}
      title={isBanned ? 'Quitar baneo' : 'Banear (Suspender cuenta)'}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        isBanned 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600'
      }`}
    >
      <Ban className="w-4 h-4" />
    </button>
  )
}
