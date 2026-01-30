import { useEffect, useState } from 'react';
import { ThemeSection } from '../components/themes/themeSection';
import supabase from '../lib/supabase';
import { getCurrentUserId } from '../services/userService';

export default function Home() {
    const [themes, setThemes] = useState<{ id: string; title: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        const fetchThemes = async () => {
            const { data, error } = await supabase
                .from('themes')
                .select('id, title, created_at')
                .order('created_at', { ascending: false })
            if (!isMounted) return
            if (error) {
                setErrorMessage(error.message)
                setIsLoading(false)
                return
            }
            setThemes((data ?? []).map((row) => ({ id: row.id, title: row.title })))
            setIsLoading(false)
        }
        fetchThemes()
        return () => {
            isMounted = false
        }
    }, [])

    const handleAddTheme = async () => {
        const title = window.prompt('Titre du thème ?')
        const trimmed = title?.trim()
        if (!trimmed) return
        const { userId, error: userError } = await getCurrentUserId()
        if (userError || !userId) {
            setErrorMessage(userError?.message ?? 'Utilisateur non connecté.')
            return
        }
        const { data, error } = await supabase
            .from('themes')
            .insert([{ title: trimmed, user_id: userId }])
            .select('id, title')
            .single()
        if (error) {
            setErrorMessage(error.message)
            return
        }
        if (data) {
            setThemes((prev) => [{ id: data.id, title: data.title }, ...prev])
        }
    }

    return (
        <main className="w-full px-12 py-8">
            <header className="flex flex-col gap-2 mb-4">
                <h1 className="text-3xl font-semibold text-zinc-900">Un journal des souvenirs avec Mémère</h1>
                <p className="font-['Dancing_Script',cursive] text-[#6f5a96] text-xl">
                    Une page simple pour noter les moments et anecdotes que l'on a partagés avec Mémère🪻
                </p>
            </header>

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                {isLoading ? (
                    <p className="text-sm text-zinc-500">Chargement…</p>
                ) : (
                    themes.map((theme) => (
                        <ThemeSection key={theme.id} title={theme.title} themeId={theme.id} />
                    ))
                )}
                {errorMessage ? (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                ) : null}
                <button
                    className="w-full rounded-md border border-dashed border-stone-300 bg-white/70 px-4 py-3 text-sm text-zinc-700 hover:border-stone-400"
                    type="button"
                    onClick={handleAddTheme}
                >
                    + Ajouter un thème
                </button>
            </div>
        </main>
    )
}
