import { createCookieSessionStorage } from '@remix-run/cloudflare'

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: '__session',
			secrets: ['oooOOooOOoOOoOOOOoo'],
			// Lax by default; good for POST-redirect-GET flows
			sameSite: 'lax',
			httpOnly: true,
			path: '/',
			// Only mark Secure in production so local dev over http still works
			secure: process.env.NODE_ENV === 'production',
			// Share between apex and www in production
			domain: process.env.NODE_ENV === 'production' ? '.akbuzat.net' : undefined,
			maxAge: 60 * 60 * 24 * 365, // 1 year
		},
	})
