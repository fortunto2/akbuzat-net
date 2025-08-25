import type { Env } from '~/types/Env'

/**
 * Rate limiting utility functions
 */

export interface RateLimitResult {
	allowed: boolean
	remaining: number
}

export interface CallDurationResult {
	allowed: boolean
	remaining: number
	elapsed?: number
	startTime?: number
}

export interface CleanupResult {
	cleaned: number
	rooms: string[]
	roomsToNotify: string[]
}

/**
 * Check if room creation is allowed for the current IP
 */
export async function checkRoomCreationLimit(
	env: Env,
	request: Request
): Promise<RateLimitResult> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	const response = await rateLimiter.fetch(
		new Request('https://rate-limiter/check-room-creation', {
			headers: {
				'CF-Connecting-IP':
					request.headers.get('CF-Connecting-IP') || 'unknown',
			},
		})
	)

	return response.json<RateLimitResult>()
}

/**
 * Check if connection to room is allowed for the current IP
 */
export async function checkConnectionLimit(
	env: Env,
	request: Request
): Promise<RateLimitResult> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	const response = await rateLimiter.fetch(
		new Request('https://rate-limiter/check-connection', {
			headers: {
				'CF-Connecting-IP':
					request.headers.get('CF-Connecting-IP') || 'unknown',
			},
		})
	)

	return response.json<RateLimitResult>()
}

/**
 * Check general API rate limit for the current IP
 */
export async function checkApiRateLimit(
	env: Env,
	request: Request
): Promise<RateLimitResult> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	const response = await rateLimiter.fetch(
		new Request('https://rate-limiter/check-api-rate', {
			headers: {
				'CF-Connecting-IP':
					request.headers.get('CF-Connecting-IP') || 'unknown',
			},
		})
	)

	return response.json<RateLimitResult>()
}

/**
 * Middleware for rate limiting API routes
 */
export async function withRateLimit<T>(
	env: Env,
	request: Request,
	handler: () => Promise<T>
): Promise<T | Response> {
	const rateLimit = await checkApiRateLimit(env, request)

	if (!rateLimit.allowed) {
		return new Response('Rate limit exceeded', {
			status: 429,
			headers: {
				'Retry-After': '60',
				'X-RateLimit-Remaining': '0',
			},
		})
	}

	return handler()
}

/**
 * Check if call duration limit is exceeded for a room
 */
export async function checkCallDuration(
	env: Env,
	roomId: string
): Promise<CallDurationResult> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	const response = await rateLimiter.fetch(
		new Request(`https://rate-limiter/check-call-duration?roomId=${roomId}`)
	)

	return response.json<CallDurationResult>()
}

/**
 * Cleanup old and empty rooms
 */
export async function cleanupOldRooms(env: Env): Promise<CleanupResult> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	const response = await rateLimiter.fetch(
		new Request('https://rate-limiter/cleanup-old-rooms')
	)

	return response.json<CleanupResult>()
}

/**
 * Mark room as empty for cleanup tracking
 */
export async function markRoomEmpty(env: Env, roomId: string): Promise<void> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	// Call internal method via fetch
	await rateLimiter.fetch(
		new Request('https://rate-limiter/mark-room-empty', {
			method: 'POST',
			body: JSON.stringify({ roomId }),
			headers: { 'Content-Type': 'application/json' },
		})
	)
}

/**
 * Mark room as active (remove from cleanup tracking)
 */
export async function markRoomActive(env: Env, roomId: string): Promise<void> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	await rateLimiter.fetch(
		new Request('https://rate-limiter/mark-room-active', {
			method: 'POST',
			body: JSON.stringify({ roomId }),
			headers: { 'Content-Type': 'application/json' },
		})
	)
}

/**
 * End call and cleanup duration tracking
 */
export async function endCall(env: Env, roomId: string): Promise<void> {
	const rateLimiterId = env.rateLimiter.idFromName('global')
	const rateLimiter = env.rateLimiter.get(rateLimiterId)

	await rateLimiter.fetch(
		new Request('https://rate-limiter/end-call', {
			method: 'POST',
			body: JSON.stringify({ roomId }),
			headers: { 'Content-Type': 'application/json' },
		})
	)
}
