import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import { nanoid } from 'nanoid'
import invariant from 'tiny-invariant'
import { Button, ButtonLink } from '~/components/Button'
import { Disclaimer } from '~/components/Disclaimer'
import { Input } from '~/components/Input'
import { Label } from '~/components/Label'
import { useUserMetadata } from '~/hooks/useUserMetadata'
import { ACCESS_AUTHENTICATED_USER_EMAIL_HEADER } from '~/utils/constants'
import getUsername from '~/utils/getUsername.server'

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const directoryUrl = context.USER_DIRECTORY_URL
	const username = await getUsername(request)
	invariant(username)
	const usedAccess = request.headers.has(ACCESS_AUTHENTICATED_USER_EMAIL_HEADER)
	return json({ username, usedAccess, directoryUrl })
}

export const action: ActionFunction = async ({ request }) => {
	const room = (await request.formData()).get('room')
	invariant(typeof room === 'string')
	return redirect(room.replace(/ /g, '-'))
}

export default function Index() {
	const { username, usedAccess } = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	const { data } = useUserMetadata(username)

	return (
		<div className="flex flex-col items-center justify-center h-full p-4 mx-auto">
			<div className="flex-1 flex flex-col items-center justify-center">
				<img 
					src="/logo.svg" 
					alt="Akbuzat.net" 
					className="w-40 h-40 object-contain"
				/>
				<h1 className="text-2xl font-bold text-center mt-2 text-green-700">Akbuzat.net</h1>
			</div>
			<div className="space-y-6 sm:min-w-96">
				<div>
					<div className="flex items-center justify-between gap-3">
						<p className="text-sm text-zinc-500">
							Вы вошли как {data?.displayName}
						</p>
						{!usedAccess && (
							<a
								className="block text-sm underline text-zinc-500 hover:text-zinc-700"
								href="/set-username"
							>
								Изменить
							</a>
						)}
					</div>
				</div>
				<div>
					<ButtonLink
						to="/new"
						className="text-sm"
						onClick={(e) => {
							// We shouldn't need a whole server visit to start a new room,
							// so let's just do a redirect here
							e.preventDefault()
							navigate(`/${nanoid(8)}`)
							// if someone clicks the link to create a new room
							// before the js has loaded then we'll use a server side redirect
							// (in new.tsx) to send the user to a new room
						}}
					>
						Новая комната
					</ButtonLink>
				</div>
				<details className="cursor-pointer">
					<summary className="text-zinc-500">
						Или присоединиться к комнате
					</summary>
					<Form
						className="grid items-end gap-4 grid-cols-[1fr_auto] w-full pt-4"
						method="post"
					>
						<div className="space-y-2">
							<Label htmlFor="room">Название комнаты</Label>
							<Input name="room" id="room" required />
						</div>
						<Button className="text-xs" type="submit" displayType="secondary">
							Войти
						</Button>
					</Form>
				</details>
			</div>
			<div className="flex flex-col justify-end flex-1">
				<div className="max-w-2xl mx-auto mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
					<div className="text-center space-y-2">
						<p className="font-medium text-green-700">🔒 Безопасные видеозвонки для друзей</p>
						<p>Некоммерческий проект • Звонки не записываются • P2P соединения с шифрованием</p>
						<div className="flex flex-wrap justify-center gap-4 text-xs mt-3">
							<span className="flex items-center gap-1">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>
								Без регистрации
							</span>
							<span className="flex items-center gap-1">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>
								E2E шифрование
							</span>
							<span className="flex items-center gap-1">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>
								Низкая задержка
							</span>
							<span className="flex items-center gap-1">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>
								<a href="https://docs.realtime.cloudflare.com/" className="hover:text-green-600 underline">
									Cloudflare
								</a>
							</span>
						</div>
					</div>
				</div>
				<Disclaimer className="pt-6" />
			</div>
		</div>
	)
}
