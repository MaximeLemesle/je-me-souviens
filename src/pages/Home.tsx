import { useEffect, useState } from 'react';
import { HomeHeader } from '../components/home/HomeHeader';
import { AddThemeModal } from '../components/themes/AddThemeModal';
import { ThemeSection } from '../components/themes/themeSection';
import supabase from '../lib/supabase';
import { getCurrentUserId } from '../services/userService';

export default function Home() {
    const [themes, setThemes] = useState<{ id: string; title: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isAddThemeOpen, setIsAddThemeOpen] = useState(false)
    const [isAddingTheme, setIsAddingTheme] = useState(false)
    const [addThemeError, setAddThemeError] = useState<string | null>(null)

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

    const handleAddTheme = () => {
        setAddThemeError(null)
        setIsAddThemeOpen(true)
    }

    const handleCreateTheme = async (title: string) => {
        const trimmed = title.trim()
        if (!trimmed) {
            setAddThemeError('Merci de saisir un titre.')
            return false
        }

        setIsAddingTheme(true)
        setAddThemeError(null)

        try {
            const { userId, error: userError } = await getCurrentUserId()
            if (userError || !userId) {
                setAddThemeError(userError?.message ?? 'Utilisateur non connecté.')
                return false
            }
            const { data, error } = await supabase
                .from('themes')
                .insert([{ title: trimmed, user_id: userId }])
                .select('id, title')
                .single()
            if (error) {
                setAddThemeError(error.message)
                return false
            }
            if (data) {
                setThemes((prev) => [{ id: data.id, title: data.title }, ...prev])
            }
            return true
        } finally {
            setIsAddingTheme(false)
        }
    }

    return (
        <main className="w-full px-4 py-6 sm:px-12 sm:py-8">
            <HomeHeader
                title="Un journal des souvenirs avec Mémère"
                subtitle="Une page simple pour noter les moments et anecdotes que l'on a partagés avec Mémère🪻"
            />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 mt-8">
                <button
                    className="w-full rounded-md border border-dashed border-stone-300 bg-white/70 px-4 py-3 text-sm text-zinc-700 hover:border-stone-400"
                    type="button"
                    onClick={handleAddTheme}
                >
                    + Ajouter un thème
                </button>
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

            </div>

            {/* Modal displayed to add a new theme */}
            <AddThemeModal
                open={isAddThemeOpen}
                onOpenChange={(open) => {
                    setIsAddThemeOpen(open)
                    if (!open) setAddThemeError(null)
                }}
                onSubmit={handleCreateTheme}
                isSubmitting={isAddingTheme}
                errorMessage={addThemeError}
            />
        </main>
    )
}
