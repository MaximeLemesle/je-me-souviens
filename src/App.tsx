import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import Home from './pages/Home'
import supabase from './lib/supabase'
import Auth from './pages/Auth'
import { LogoutButtonContainer } from './components/auth/LogoutButtonContainer'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900">
      <div className="fixed right-6 top-6 z-50">
        <LogoutButtonContainer />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
