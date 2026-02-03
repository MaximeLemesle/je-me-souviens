import { LogoutButtonContainer } from "../auth/LogoutButtonContainer"

type HomeHeaderProps = {
  title: string
  subtitle: string
}

export function HomeHeader({ title, subtitle }: HomeHeaderProps) {
  return (
    <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
          <div className="pt-1 sm:hidden">
            <LogoutButtonContainer />
          </div>
        </div>
        <p className="font-['Dancing_Script',cursive] text-[#6f5a96] text-xl">
          {subtitle}
        </p>
      </div>
      <div className="hidden pt-1 sm:block">
        <LogoutButtonContainer />
      </div>
    </header>
  )
}
