'use client'

import { useState } from 'react'
import { PauseCircle, PlayCircle } from 'lucide-react'
import { toggleMyRaffleStatusAction } from '../../../utils/adminActions'

export function OrganizerRaffleControls({ raffleId, currentStatus }) {
  const [isLoading, setIsLoading] = useState(false)
  const isPaused = currentStatus === 'PAUSED'

  const handleToggle = async () => {
    if (!window.confirm(`¿Estás seguro de ${isPaused ? 'ACTIVAR' : 'PAUSAR'} tu rifa? ${isPaused ? 'Tus compradores podrán volver a reservar números.' : 'Tus compradores verán un aviso y no podrán reservar números hasta que la reactives.'}`)) return
    
    setIsLoading(true)
    try {
      await toggleMyRaffleStatusAction(raffleId, isPaused ? 'ACTIVE' : 'PAUSED')
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
      className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 ${
        isPaused 
          ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
          : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'
      }`}
    >
      {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
      {isPaused ? 'Activar Rifa' : 'Pausar Rifa'}
    </button>
  )
}
