import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
    fetchMemoriesByThemeId,
    type MemoryRow,
} from '../../repositories/memoryRepository'
import supabase from '../../lib/supabase'
import { getCurrentUserId, getProfilesMapByIds, type UserProfile } from '../../services/userService'
import { UserUtils } from '../../lib/user.utils'
import { Badge } from '../ui/badge'

function buildMemoriesFromRows(
    rows: MemoryRow[],
    profilesById: Record<string, UserProfile>,
): { text: string; initials: string }[] {
    return rows.map((row) => ({
        text: row.text,
        initials: UserUtils.getInitials(profilesById[row.user_id ?? '']),
    }))
}

export function ThemeSection({ title, themeId }: { title: string; themeId: string }) {
    const [memories, setMemories] = useState<{ text: string; initials: string }[]>([])
    const [draft, setDraft] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        const fetchMemories = async () => {
            const { data, error } = await fetchMemoriesByThemeId(themeId)
            if (error) {
                setErrorMessage(error.message)
                setIsLoading(false)
                return
            }
            const rows = data ?? []
            const userIds = Array.from(
                new Set(rows.map((row) => row.user_id).filter(Boolean)),
            ) as string[]
            const { profilesById } = await getProfilesMapByIds(userIds)
            setMemories(buildMemoriesFromRows(rows, profilesById))
            setIsLoading(false)
        }
        fetchMemories()
    }, [themeId])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmed = draft.trim()
        if (!trimmed) return

        setIsSaving(true)
        setErrorMessage(null)

        try {
            const { userId, error: userError } = await getCurrentUserId()
            if (userError || !userId) {
                setErrorMessage(userError?.message ?? 'Utilisateur non connecté.')
                return
            }

            const { error } = await supabase
                .from('memories')
                .insert([{ text: trimmed, user_id: userId, theme_id: themeId }])
                .select('text, user_id')
                .single()

            if (error) {
                setErrorMessage(error.message)
                return
            }

            setDraft('')
            setIsLoading(true)

            const { data: latestData, error: latestError } =
                await fetchMemoriesByThemeId(themeId)
            if (latestError) {
                setErrorMessage(latestError.message)
                return
            }

            const rows = latestData ?? []
            const userIds = Array.from(
                new Set(rows.map((row) => row.user_id).filter(Boolean)),
            ) as string[]
            const { profilesById: nextProfilesById, error: profilesError } =
                await getProfilesMapByIds(userIds)
            if (profilesError) {
                setErrorMessage(profilesError.message)
            }
            setMemories(buildMemoriesFromRows(rows, nextProfilesById))
        } finally {
            setIsSaving(false)
            setIsLoading(false)
        }
    }

    return (
        <Card className="bg-white/90">
            <CardHeader>
                <CardTitle className="font-['Dancing_Script',cursive] text-2xl pb-2">
                    Je me souviens {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {isLoading ? (
                    <p className="text-sm text-zinc-500">Chargement…</p>
                ) : (
                    <ul className="flex flex-col gap-3 text-sm text-zinc-700">
                        {memories.map((memory, index) => (
                            <li
                                key={`${memory.text}-${index}`}
                                className="flex items-center gap-3 rounded-md border border-[#e6def5] bg-[#fbf8ff] px-4 py-3"
                            >
                                <span className="flex-1">{memory.text}</span>
                                <Badge variant="outline" className="ml-auto">{memory.initials}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Label htmlFor="memory" className="text-sm font-medium text-zinc-700">
                        Ajouter un souvenir
                    </Label>
                    <Textarea
                        id="memory"
                        placeholder="Je me souviens..."
                        className="bg-white"
                        value={draft}
                        onChange={event => setDraft(event.target.value)}
                    />
                    {errorMessage ? (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    ) : null}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="justify-end" />
        </Card>
    )
}
