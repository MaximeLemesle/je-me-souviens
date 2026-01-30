import { useState } from 'react'
import supabase from '../lib/supabase'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const signUp = async () => {
        setLoading(true)
        setErrorMessage(null)
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    const signIn = async () => {
        setLoading(true)
        setErrorMessage(null)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
            <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-zinc-900">Connexion</h1>
                <p className="mt-1 text-sm text-zinc-600">Crée un compte ou connecte-toi.</p>
                <div className="mt-4 flex flex-col gap-3">
                    <input
                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <input
                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                        type="password"
                        placeholder="mot de passe"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    {errorMessage ? (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    ) : null}
                    <div className="flex gap-2">
                        <button
                            className="flex-1 rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
                            onClick={signIn}
                            disabled={loading}
                        >
                            Se connecter
                        </button>
                        <button
                            className="flex-1 rounded-md border border-stone-200 px-3 py-2 text-sm disabled:opacity-60"
                            onClick={signUp}
                            disabled={loading}
                        >
                            Créer un compte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
