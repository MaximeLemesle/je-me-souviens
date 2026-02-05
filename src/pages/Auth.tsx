import { useState } from 'react'
import { signInWithPassword, signUpWithEmail } from '../services/authService'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const signUp = async () => {
        setLoading(true)
        setErrorMessage(null)
        const trimmedFirstName = firstName.trim()
        const trimmedLastName = lastName.trim()
        const { error } = await signUpWithEmail(email, password, trimmedFirstName, trimmedLastName)
        if (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    const signIn = async () => {
        setLoading(true)
        setErrorMessage(null)
        const { error } = await signInWithPassword(email, password)
        if (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    const handleSubmit = async () => {
        if (isSignUp) {
            await signUp()
        } else {
            await signIn()
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
            <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex rounded-md border border-stone-200 bg-stone-100 p-1 text-sm">
                    <button
                        className={`text-xl font-semibold flex-1 rounded-md px-3 py-2 transition ${!isSignUp ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                        type="button"
                        onClick={() => setIsSignUp(false)}
                        disabled={loading}
                    >
                        Connexion
                    </button>
                    <button
                        className={`text-xl font-semibold flex-1 rounded-md px-3 py-2 transition ${isSignUp ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        disabled={loading}
                    >
                        Inscription
                    </button>
                </div>
                <p className="mt-2 text-sm text-zinc-600">
                    {isSignUp ? 'Crée ton compte pour commencer.' : 'Connecte-toi pour continuer.'}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                    {isSignUp ? (
                        <div className="flex gap-2">
                            <input
                                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                                type="text"
                                placeholder="prénom"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                            />
                            <input
                                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                                type="text"
                                placeholder="nom"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                        </div>
                    ) : null}
                    <input
                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <div className="relative">
                        <input
                            className="w-full rounded-md border border-stone-200 px-3 py-2 pr-10 text-sm"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="mot de passe"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 transition hover:text-zinc-700"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            aria-pressed={showPassword}
                        >
                            {showPassword ? (
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2.5 12s3.8-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.8 6.5-9.5 6.5-9.5-6.5-9.5-6.5Z" />
                                    <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
                                    <path d="M4 4l16 16" />
                                </svg>
                            ) : (
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2.5 12s3.8-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.8 6.5-9.5 6.5-9.5-6.5-9.5-6.5Z" />
                                    <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errorMessage ? (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    ) : null}
                    <button
                        className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {isSignUp ? 'Créer un compte' : 'Se connecter'}
                    </button>
                </div>
            </div>
        </div>
    )
}
