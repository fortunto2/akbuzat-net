import { forwardRef } from 'react'
import { cn } from '~/utils/style'

export const Input = forwardRef<
	HTMLInputElement,
	JSX.IntrinsicElements['input']
>(({ className, ...rest }, ref) => (
	<input
		className={cn(
			'w-full',
			'rounded',
			'border-2',
			'border-zinc-300',
			'text-zinc-900',
			'bg-white',
			'px-2',
			'py-1',
			'focus:border-green-500',
			'focus:outline-none',
			className
		)}
		{...rest}
		ref={ref}
	/>
))

Input.displayName = 'Input'
