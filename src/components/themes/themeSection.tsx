import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
    fetchMemoriesByThemeId,
    type MemoryEntity,
} from '../../repositories/memoryRepository'
import supabase from '../../lib/supabase'
import { getCurrentUserId } from '../../services/userService'
import { UserUtils } from '../../lib/user.utils'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Trash2 } from 'lucide-react'

async function buildMemories(
    memories: MemoryEntity[],
): Promise<{ id: string; text: string; initials: string; fullName: string; userId: string }[]> {
    const results = await Promise.all(
        memories.map(async (memory) => ({
            id: memory.id,
            text: memory.text,
            initials: await UserUtils.getInitials(memory.user_id),
            fullName: await UserUtils.getFullName(memory.user_id),
            userId: memory.user_id,
        })),
    )
    return results
}

export function ThemeSection({ title, themeId }: { title: string; themeId: string }) {
    const [memories, setMemories] = useState<{ id: string; text: string; initials: string; fullName: string; userId: string }[]>([])
    const [draft, setDraft] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const formattedTitle = title ? title[0].toLowerCase() + title.slice(1) : title

    useEffect(() => {
        const fetchUser = async () => {
            const { userId } = await getCurrentUserId()
            setCurrentUserId(userId ?? null)
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchMemories = async () => {
            const { data, error } = await fetchMemoriesByThemeId(themeId)
            if (error) {
                setErrorMessage(error.message)
                setIsLoading(false)
                return
            }
            const memories = data ?? []
            setMemories(await buildMemories(memories))
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

            const memories = latestData ?? []
            setMemories(await buildMemories(memories))
        } finally {
            setIsSaving(false)
            setIsLoading(false)
        }
    }

    const handleDelete = async (memoryId: string) => {
        if (!currentUserId) {
            setErrorMessage('Utilisateur non connecté.')
            return
        }
        const confirmed = window.confirm('Supprimer ce souvenir ?')
        if (!confirmed) return
        setErrorMessage(null)
        const { error } = await supabase
            .from('memories')
            .delete()
            .eq('id', memoryId)
            .eq('user_id', currentUserId)
        if (error) {
            setErrorMessage(error.message)
            return
        }
        setMemories((prev) => prev.filter((memory) => memory.id !== memoryId))
    }

    return (
        <Card className="bg-white/90">
            <CardHeader>
                <CardTitle className="text-2xl pb-2">
                    <span className="font-['Dancing_Script',cursive] text-[#6f5a96]">
                        Je me souviens
                    </span>
                    <span className="text-zinc-900"> {formattedTitle}</span>
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

                                <div className="ml-auto flex items-center gap-2">
                                    {currentUserId === memory.userId ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-500 hover:text-red-600"
                                            onClick={() => handleDelete(memory.id)}
                                            aria-label="Supprimer le souvenir"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    ) : null}

                                    <TooltipProvider>
                                        <Tooltip
                                            open={activeTooltipIndex === index}
                                            onOpenChange={(open) => {
                                                setActiveTooltipIndex(open ? index : null)
                                            }}
                                        >
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                    style={{
                                                        backgroundColor: '#6f5a96',
                                                        color: '#fff',
                                                        borderColor: '#6f5a96'
                                                    }}
                                                    onClick={() => {
                                                        setActiveTooltipIndex((current) =>
                                                            current === index ? null : index
                                                        )
                                                    }}
                                                >
                                                    {memory.initials}
                                                </Badge>
                                            </TooltipTrigger>

                                            <TooltipContent
                                                side="top"
                                                align="center"
                                                className="rounded-lg border border-[#e6def5] bg-white/95 px-3 py-2 text-xs text-zinc-800 shadow-md backdrop-blur mb-1"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{memory.fullName}</span>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
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
