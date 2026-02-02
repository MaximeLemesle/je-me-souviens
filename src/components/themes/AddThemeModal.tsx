import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type AddThemeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (title: string) => Promise<boolean>
  isSubmitting: boolean
  errorMessage: string | null
}

export function AddThemeModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  errorMessage,
}: AddThemeModalProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const success = await onSubmit(title)
    if (success) {
      onOpenChange(false)
      setTitle("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un thème</DialogTitle>
          <DialogDescription>
            Donne un titre simple pour créer une nouvelle catégorie de souvenirs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="theme-title">Je me souviens...</Label>
            <Input
              id="theme-title"
              placeholder="Ex : des chansons qu'elle aimait écouter"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </div>
          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout…" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
