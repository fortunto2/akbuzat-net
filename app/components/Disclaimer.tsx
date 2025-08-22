import type { FC } from 'react'
import { cn } from '~/utils/style'

interface DisclaimerProps {
	className?: string
}

export const Disclaimer: FC<DisclaimerProps> = ({ className }) => {
	return (
		<p
			className={cn(
				'text-xs text-zinc-400 max-w-prose text-center',
				className
			)}
		>
			Основано на{' '}
			<a className="underline hover:text-zinc-600" href="https://github.com/cloudflare/orange">
				github.com/cloudflare/orange
			</a>
		</p>
	)
}
