import { commitSession, getSession } from '~/session'
import { parse as parseCookie } from 'cookie'
import { ACCESS_AUTHENTICATED_USER_EMAIL_HEADER } from './constants'
import { safeRedirect } from './safeReturnUrl'

export async function setUsername(
	username: string,
	request: Request,
	returnUrl: string = '/'
) {
	const session = await getSession(request.headers.get('Cookie'))
	session.set('username', username)
	throw safeRedirect(returnUrl, {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	})
}

/**
 * Utility for getting the username. In prod, this basically
 * just consists of getting the Cf-Access-Authenticated-User-Email
 * header, but in dev we allow manually setting this via the
 * username query param.
 */
export default async function getUsername(request: Request) {
	const accessUsername = request.headers.get(
		ACCESS_AUTHENTICATED_USER_EMAIL_HEADER
	)
	if (accessUsername) return accessUsername

	const session = await getSession(request.headers.get('Cookie'))
	const sessionUsername = session.get('username')
	if (typeof sessionUsername === 'string') return sessionUsername

	// Fallback: accept a plain `username` cookie if present (useful for quick checks)
	const raw = request.headers.get('Cookie')
	if (raw) {
		const { username } = parseCookie(raw)
		if (typeof username === 'string' && username.trim()) return username
	}

	return null
}
