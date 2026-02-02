import { LogoutButtonContainer } from "../auth/LogoutButtonContainer"

type HomeHeaderProps = {
  title: string
  subtitle: string
}

export function HomeHeader({ title, subtitle }: HomeHeaderProps) {
  return (
    <header className="mb-4 flex flex-row flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
        <p className="font-['Dancing_Script',cursive] text-[#6f5a96] text-xl">
          {subtitle}
        </p>
      </div>
      <div className="pt-1">
        <LogoutButtonContainer />
      </div>
    </header>
  )
}
