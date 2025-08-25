import { type ApiHistoryEntry } from 'partytracks/client'
import type { TrackObject } from '~/utils/callsTypes'

export type User = {
	id: string
	name: string
	transceiverSessionId?: string
	raisedHand: boolean
	speaking: boolean
	joined: boolean
	tracks: {
		audio?: string
		audioEnabled?: boolean
		audioUnavailable: boolean
		video?: string
		videoEnabled?: boolean
		screenshare?: string
		screenShareEnabled?: boolean
	}
}

export type RoomState = {
	meetingId?: string
	users: User[]
	ai: {
		enabled: boolean
		controllingUser?: string
		error?: string
		connectionPending?: boolean
	}
}

export type ServerMessage =
	| {
			type: 'roomState'
			state: RoomState
	  }
	| {
			type: 'error'
			error?: string
	  }
	| {
			type: 'directMessage'
			from: string
			message: string
	  }
	| {
			type: 'muteMic'
	  }
	| {
			type: 'partyserver-pong'
	  }
	| {
			type: 'e2eeMlsMessage'
			payload: string
	  }
	| {
			type: 'userLeftNotification'
			id: string
	  }
	| {
			type: 'callTimeWarning'
			message: string
			remaining: number
	  }
	| {
			type: 'callTimeExpired'
			message: string
			remaining: number
	  }

export type ClientMessage =
	| {
			type: 'userUpdate'
			user: User
	  }
	| {
			type: 'directMessage'
			to: string
			message: string
	  }
	| {
			type: 'muteUser'
			id: string
	  }
	| {
			type: 'userLeft'
	  }
	| {
			type: 'partyserver-ping'
	  }
	| {
			type: 'heartbeat'
	  }
	| {
			type: 'enableAi'
			instructions?: string
			voice?: string
	  }
	| {
			type: 'disableAi'
	  }
	| {
			type: 'requestAiControl'
			track: TrackObject
	  }
	| {
			type: 'relenquishAiControl'
	  }
	| {
			type: 'callsApiHistoryEntry'
			entry: ApiHistoryEntry
			sessionId?: string
	  }
	| {
			type: 'e2eeMlsMessage'
			payload: string
	  }
