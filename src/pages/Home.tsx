import { InputSection } from '../components/ui/inputSection'

export default function Home() {
  return (
    <main className="w-full px-12 py-8">
      <header className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-semibold text-zinc-900">Un journal des souvenirs avec Mémère</h1>
        <p className="font-['Dancing_Script',cursive] text-[#6f5a96] text-xl">
          Une page simple pour noter les moments et anecdotes que l'on a partagés avec Mémère🪻
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <InputSection title="Les repas qu'elle aimait" />
        <InputSection title="Les musiques qu'elle aimait" />
      </div>
    </main>
  )
}
