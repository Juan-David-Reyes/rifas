import { getSiteSettings } from '../../utils/settingsActions'
import CrearClient from './CrearClient'

export const dynamic = 'force-dynamic'

export default async function CrearPage() {
  const settings = await getSiteSettings()
  
  return (
    <CrearClient initialSettings={settings} />
  )
}
