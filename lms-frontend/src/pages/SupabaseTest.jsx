import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function SupabaseTest() {
  const [status, setStatus] = useState('Testing Supabase connection...')

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.auth.getSession()

      if (error) {
        setStatus(`Connection failed: ${error.message}`)
        return
      }

      setStatus('Supabase connected successfully!')
    }

    testConnection()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">{status}</h1>
      </div>
    </div>
  )
}

export default SupabaseTest