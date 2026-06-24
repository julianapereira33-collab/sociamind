import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Auth from './src/Auth.jsx'
import { supabase } from './src/supabase.js'

function Root() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Supabase não configurado — modo localStorage (dev local sem env vars)
  const supabaseConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON
  )

  if (!supabaseConfigured) return <App />

  if (session === undefined) return (
    <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#1565C0', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Carregando…</div>
    </div>
  )

  if (!session) return <Auth onAuth={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />

  return <App session={session} onSignOut={() => supabase.auth.signOut()} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
