import type { FC } from 'react'
import { cn } from '~/utils/style'

interface DisclaimerProps {
	className?: string
}

export const Disclaimer: FC<DisclaimerProps> = ({ className }) => {
	return (
		<div
			className={cn(
				'text-xs text-zinc-400 max-w-prose text-center space-y-1',
				className
			)}
		>
			<p>
				<a className="underline hover:text-zinc-600" href="https://github.com/fortunto2/akbuzat-net">
					GitHub репозиторий
				</a>
			</p>
		</div>
	)
}
