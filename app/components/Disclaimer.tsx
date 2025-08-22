import type { FC } from 'react'
import { cn } from '~/utils/style'

interface DisclaimerProps {
	className?: string
}

export const Disclaimer: FC<DisclaimerProps> = ({ className }) => {
	return (
		<div
			className={cn(
				'text-xs text-zinc-400 max-w-prose text-center space-y-2',
				className
			)}
		>
			{/* Основные ссылки */}
			<div className="flex flex-wrap justify-center gap-2 text-xs">
				<a className="underline hover:text-zinc-600" href="/legal/terms">
					Правила использования
				</a>
				<span className="text-zinc-300">•</span>
				<a className="underline hover:text-zinc-600" href="/legal/privacy">
					Политика конфиденциальности
				</a>
				<span className="text-zinc-300">•</span>
				<a className="underline hover:text-zinc-600" href="mailto:info@akbuzat.net?subject=Сообщить о нарушении">
					Сообщить о нарушении
				</a>
				<span className="text-zinc-300">•</span>
				<a className="underline hover:text-zinc-600" href="https://github.com/fortunto2/akbuzat-net">
					Исходники
				</a>
			</div>
			
			{/* Контакт */}
			<p>
				Вопросы: <a className="underline hover:text-zinc-600" href="mailto:info@akbuzat.net">info@akbuzat.net</a>
			</p>
		</div>
	)
}
