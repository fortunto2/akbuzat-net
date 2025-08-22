import { type ActionFunctionArgs } from '@remix-run/cloudflare'
import { Form } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Button } from '~/components/Button'
import { Input } from '~/components/Input'
import { ACCESS_AUTHENTICATED_USER_EMAIL_HEADER } from '~/utils/constants'
import { setUsername } from '~/utils/getUsername.server'
import { safeRedirect } from '~/utils/safeReturnUrl'

export const action = async ({ request }: ActionFunctionArgs) => {
	const url = new URL(request.url)
	const returnUrl = url.searchParams.get('return-url') ?? '/'
	const accessUsername = request.headers.get(
		ACCESS_AUTHENTICATED_USER_EMAIL_HEADER
	)
	if (accessUsername) throw safeRedirect(returnUrl)
	const { username } = Object.fromEntries(await request.formData())
	invariant(typeof username === 'string')
	return setUsername(username, request, returnUrl)
}

export default function SetUsername() {
	return (
		<div className="flex flex-col h-full items-center justify-center gap-8 px-4">
			<div className="flex flex-col items-center">
				<img 
					src="/logo.svg" 
					alt="Akbuzat.net" 
					className="w-32 h-32 object-contain"
				/>
				<h1 className="text-2xl font-bold text-center mt-2 text-green-700">Akbuzat.net</h1>
			</div>
			
			<Form className="flex flex-col items-center gap-4 w-full max-w-sm" method="post">
				<div className="w-full">
					<label htmlFor="username" className="block text-center text-gray-700 mb-3">
						Введите ваше отображаемое имя
					</label>
					<Input
						autoComplete="off"
						autoFocus
						required
						type="text"
						id="username"
						name="username"
						className="text-center"
					/>
				</div>
				<Button className="text-sm px-6 py-2" type="submit">
					Отправить
				</Button>
			</Form>
		</div>
	)
}
