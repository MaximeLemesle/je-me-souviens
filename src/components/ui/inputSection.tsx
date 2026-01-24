import { useState } from 'react'
import { Button } from './button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card'
import { Textarea } from './textarea'

export function InputSection({ title }: { title: string }) {
    const [memories, setMemories] = useState<string[]>([])
    const [draft, setDraft] = useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmed = draft.trim()
        if (!trimmed) return
        setMemories((prev) => [trimmed, ...prev])
        setDraft('')
    }

    return (
        <Card className="bg-white/90">
            <CardHeader>
                <CardTitle className="font-['Dancing_Script',cursive] text-2xl pb-2">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <ul className="flex flex-col gap-3 text-sm text-zinc-700">
                    {memories.map((memory, index) => (
                        <li
                            key={`${memory}-${index}`}
                            className="rounded-md border border-[#e6def5] bg-[#fbf8ff] px-4 py-3"
                        >
                            {memory}
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label htmlFor="memory" className="text-sm font-medium text-zinc-700">
                        Ajouter un souvenir
                    </label>
                    <Textarea
                        id="memory"
                        placeholder="Je me souviens..."
                        className="bg-white"
                        value={draft}
                        onChange={event => setDraft(event.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button type="submit">Enregistrer</Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="justify-end" />
        </Card>
    )
}
