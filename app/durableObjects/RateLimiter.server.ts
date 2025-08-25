import type { Env } from '~/types/Env'

/**
 * RateLimiter Durable Object
 *
 * Provides rate limiting functionality for:
 * - Room creation limits
 * - Connection limits per IP
 * - API request limits
 */
export class RateLimiter {
	private ctx: DurableObjectState
	private env: Env

	constructor(ctx: DurableObjectState, env: Env) {
		this.ctx = ctx
		this.env = env
	}

	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)
		const action = url.pathname.slice(1) // remove leading slash

		switch (action) {
			case 'check-room-creation':
				return this.handleRoomCreationLimit(request)
			case 'check-connection':
				return this.handleConnectionLimit(request)
			case 'check-api-rate':
				return this.handleApiRateLimit(request)
			case 'check-call-duration':
				return this.handleCallDurationLimit(request)
			case 'cleanup-old-rooms':
				return this.handleRoomCleanup(request)
			case 'mark-room-empty':
				return this.handleMarkRoomEmpty(request)
			case 'mark-room-active':
				return this.handleMarkRoomActive(request)
			case 'end-call':
				return this.handleEndCall(request)
			default:
				return new Response('Unknown action', { status: 400 })
		}
	}

	/**
	 * Check if IP can create a new room
	 * Limit: 5 rooms per hour per IP
	 */
	private async handleRoomCreationLimit(request: Request): Promise<Response> {
		const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
		const key = `room-creation:${ip}`
		const limit = 5
		const windowMs = 60 * 60 * 1000 // 1 hour

		const allowed = await this.checkRateLimit(key, limit, windowMs)

		return new Response(
			JSON.stringify({
				allowed,
				remaining: allowed ? limit - (await this.getCount(key)) : 0,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)
	}

	/**
	 * Check if IP can connect to a room
	 * Limit: 20 connections per 10 minutes per IP
	 */
	private async handleConnectionLimit(request: Request): Promise<Response> {
		const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
		const key = `connections:${ip}`
		const limit = 20
		const windowMs = 10 * 60 * 1000 // 10 minutes

		const allowed = await this.checkRateLimit(key, limit, windowMs)

		return new Response(
			JSON.stringify({
				allowed,
				remaining: allowed ? limit - (await this.getCount(key)) : 0,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)
	}

	/**
	 * Check general API rate limit
	 * Limit: 100 requests per minute per IP
	 */
	private async handleApiRateLimit(request: Request): Promise<Response> {
		const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
		const key = `api:${ip}`
		const limit = 100
		const windowMs = 60 * 1000 // 1 minute

		const allowed = await this.checkRateLimit(key, limit, windowMs)

		return new Response(
			JSON.stringify({
				allowed,
				remaining: allowed ? limit - (await this.getCount(key)) : 0,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)
	}

	/**
	 * Generic rate limiting logic using sliding window
	 */
	private async checkRateLimit(
		key: string,
		limit: number,
		windowMs: number
	): Promise<boolean> {
		const now = Date.now()
		const cutoff = now - windowMs

		// Get current timestamps
		const timestamps: number[] = (await this.ctx.storage.get(key)) || []

		// Remove old timestamps outside the window
		const validTimestamps = timestamps.filter((ts) => ts > cutoff)

		// Check if we're under the limit
		if (validTimestamps.length >= limit) {
			return false
		}

		// Add current timestamp and store
		validTimestamps.push(now)
		await this.ctx.storage.put(key, validTimestamps)

		return true
	}

	/**
	 * Get current count for a key
	 */
	private async getCount(key: string): Promise<number> {
		const timestamps: number[] = (await this.ctx.storage.get(key)) || []
		return timestamps.length
	}

	/**
	 * Check if call duration limit is exceeded
	 * Limit: 1 hour maximum per call
	 */
	private async handleCallDurationLimit(request: Request): Promise<Response> {
		const url = new URL(request.url)
		const roomId = url.searchParams.get('roomId')
		
		if (!roomId) {
			return new Response('Room ID required', { status: 400 })
		}

		const key = `call-duration:${roomId}`
		const maxDurationMs = 60 * 60 * 1000 // 1 hour
		
		// Get call start time
		const startTime: number | undefined = await this.ctx.storage.get(key)
		const now = Date.now()
		
		if (!startTime) {
			// First time - record start time
			await this.ctx.storage.put(key, now)
			return new Response(
				JSON.stringify({
					allowed: true,
					remaining: maxDurationMs,
					startTime: now,
				}),
				{
					headers: { 'Content-Type': 'application/json' },
				}
			)
		}

		const elapsed = now - startTime
		const remaining = Math.max(0, maxDurationMs - elapsed)
		const allowed = elapsed < maxDurationMs

		return new Response(
			JSON.stringify({
				allowed,
				remaining,
				elapsed,
				startTime,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)
	}

	/**
	 * Handle cleanup of old rooms
	 * Removes rooms older than 2 hours and empty rooms older than 30 minutes
	 */
	private async handleRoomCleanup(request: Request): Promise<Response> {
		const now = Date.now()
		const oldRoomThreshold = 2 * 60 * 60 * 1000 // 2 hours
		const emptyRoomThreshold = 30 * 60 * 1000 // 30 minutes

		// Get all room-related keys
		const allKeys = await this.ctx.storage.list()
		const roomKeys = Array.from(allKeys.keys()).filter(key => 
			key.startsWith('call-duration:') || 
			key.startsWith('room-activity:') ||
			key.startsWith('room-empty-since:')
		)

		const cleanedRooms: string[] = []
		const roomsToNotify: string[] = []

		for (const key of roomKeys) {
			const value = allKeys.get(key)
			
			if (key.startsWith('call-duration:')) {
				const roomId = key.replace('call-duration:', '')
				const startTime = value as number
				
				// Room older than 2 hours - force cleanup
				if (now - startTime > oldRoomThreshold) {
					await this.ctx.storage.delete(key)
					await this.ctx.storage.delete(`room-activity:${roomId}`)
					await this.ctx.storage.delete(`room-empty-since:${roomId}`)
					cleanedRooms.push(roomId)
					roomsToNotify.push(roomId)
				}
			}
			
			if (key.startsWith('room-empty-since:')) {
				const roomId = key.replace('room-empty-since:', '')
				const emptySince = value as number
				
				// Empty room older than 30 minutes
				if (now - emptySince > emptyRoomThreshold) {
					await this.ctx.storage.delete(`call-duration:${roomId}`)
					await this.ctx.storage.delete(`room-activity:${roomId}`)
					await this.ctx.storage.delete(key)
					cleanedRooms.push(roomId)
				}
			}
		}

		return new Response(
			JSON.stringify({
				cleaned: cleanedRooms.length,
				rooms: cleanedRooms,
				roomsToNotify,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		)
	}

	/**
	 * Mark room as empty (for cleanup tracking)
	 */
	async markRoomEmpty(roomId: string): Promise<void> {
		const key = `room-empty-since:${roomId}`
		await this.ctx.storage.put(key, Date.now())
	}

	/**
	 * Mark room as active (remove from empty tracking)
	 */
	async markRoomActive(roomId: string): Promise<void> {
		const emptyKey = `room-empty-since:${roomId}`
		const activityKey = `room-activity:${roomId}`
		
		await this.ctx.storage.delete(emptyKey)
		await this.ctx.storage.put(activityKey, Date.now())
	}

	/**
	 * Reset rate limit for a key (admin function)
	 */
	async resetRateLimit(key: string): Promise<void> {
		await this.ctx.storage.delete(key)
	}

	/**
	 * Handle POST request to mark room as empty
	 */
	private async handleMarkRoomEmpty(request: Request): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 })
		}

		const { roomId } = (await request.json()) as { roomId?: string }
		if (!roomId) {
			return new Response('Room ID required', { status: 400 })
		}

		await this.markRoomEmpty(roomId)
		return new Response('OK')
	}

	/**
	 * Handle POST request to mark room as active
	 */
	private async handleMarkRoomActive(request: Request): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 })
		}

		const { roomId } = (await request.json()) as { roomId?: string }
		if (!roomId) {
			return new Response('Room ID required', { status: 400 })
		}

		await this.markRoomActive(roomId)
		return new Response('OK')
	}

	/**
	 * Handle POST request to end call
	 */
	private async handleEndCall(request: Request): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 })
		}

		const { roomId } = (await request.json()) as { roomId?: string }
		if (!roomId) {
			return new Response('Room ID required', { status: 400 })
		}

		await this.endCall(roomId)
		return new Response('OK')
	}

	/**
	 * End call manually (cleanup duration tracking)
	 */
	async endCall(roomId: string): Promise<void> {
		const key = `call-duration:${roomId}`
		await this.ctx.storage.delete(key)
		await this.markRoomEmpty(roomId)
	}
}
