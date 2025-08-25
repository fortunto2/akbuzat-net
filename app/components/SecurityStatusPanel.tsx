import { useObservableAsValue } from 'partytracks/react'
import { useMemo } from 'react'
import { useRoomContext } from '~/hooks/useRoomContext'
import { Icon } from './Icon/Icon'
import { Tooltip } from './Tooltip'

export function SecurityStatusPanel() {
	const {
		partyTracks,
		room: { roomState },
		e2eeSafetyNumber,
	} = useRoomContext()

	const peerConnection = useObservableAsValue(partyTracks.peerConnection$)
	const session = useObservableAsValue(partyTracks.session$)

	// Determine connection type (P2P or SFU)
	const connectionType = useMemo((): 'p2p' | 'sfu' | 'connecting' => {
		if (!peerConnection) return 'connecting'
		
		// Get connection stats to determine if using relay (SFU/TURN) or direct P2P
		return peerConnection.iceConnectionState === 'connected' ? 'sfu' : 'connecting'
	}, [peerConnection])

	// Determine encryption status
	const encryptionStatus = useMemo(() => {
		if (e2eeSafetyNumber) return 'e2ee'
		if (peerConnection?.iceConnectionState === 'connected') return 'dtls'
		return 'none'
	}, [e2eeSafetyNumber, peerConnection])

	const getConnectionIcon = () => {
		switch (connectionType) {
			case 'p2p':
				return 'userGroup'
			case 'sfu':
				return 'ServerStackIcon'
			default:
				return 'WifiIcon'
		}
	}

	const getConnectionColor = () => {
		switch (connectionType) {
			case 'p2p':
				return 'text-green-400'
			case 'sfu':
				return 'text-blue-400'
			default:
				return 'text-yellow-400'
		}
	}

	const getEncryptionIcon = () => {
		switch (encryptionStatus) {
			case 'e2ee':
				return 'LockClosedIcon'
			case 'dtls':
				return 'ShieldCheckIcon'
			default:
				return 'ExclamationTriangleIcon'
		}
	}

	const getEncryptionColor = () => {
		switch (encryptionStatus) {
			case 'e2ee':
				return 'text-green-400'
			case 'dtls':
				return 'text-blue-400'
			default:
				return 'text-yellow-400'
		}
	}

	const connectionTooltip = useMemo(() => {
		switch (connectionType) {
			case 'p2p':
				return 'P2P: Прямое подключение между участниками'
			case 'sfu':
				return 'SFU: Подключение через Cloudflare сервер (TURN/Relay)'
			default:
				return 'Подключение устанавливается...'
		}
	}, [connectionType])

	const encryptionTooltip = useMemo(() => {
		switch (encryptionStatus) {
			case 'e2ee':
				return `E2EE: Сквозное шифрование MLS активно (Safety: ${e2eeSafetyNumber?.slice(0, 8)}...)`
			case 'dtls':
				return 'DTLS: Транспортное шифрование активно'
			default:
				return 'Шифрование не активно'
		}
	}, [encryptionStatus, e2eeSafetyNumber])

	return (
		<div className="absolute top-4 left-4 flex gap-2 bg-black/60 rounded-lg px-3 py-2">
			{/* Connection Type Indicator */}
			<Tooltip content={connectionTooltip}>
				<div className={`flex items-center gap-1 ${getConnectionColor()}`}>
					<Icon type={getConnectionIcon()} className="w-4 h-4" />
					<span className="text-xs font-mono uppercase">
						{connectionType === 'connecting' ? 'CONN' : connectionType.toUpperCase()}
					</span>
				</div>
			</Tooltip>

			<div className="w-px bg-white/20 mx-1"></div>

			{/* Encryption Status Indicator */}
			<Tooltip content={encryptionTooltip}>
				<div className={`flex items-center gap-1 ${getEncryptionColor()}`}>
					<Icon type={getEncryptionIcon()} className="w-4 h-4" />
					<span className="text-xs font-mono uppercase">
						{encryptionStatus === 'e2ee' ? 'E2EE' : 
						 encryptionStatus === 'dtls' ? 'DTLS' : 'NONE'}
					</span>
				</div>
			</Tooltip>

			{/* Participants Count */}
			<div className="w-px bg-white/20 mx-1"></div>
			<Tooltip content={`Участников в комнате: ${roomState.users.length}`}>
				<div className="flex items-center gap-1 text-white/80">
					<Icon type="UsersIcon" className="w-4 h-4" />
					<span className="text-xs font-mono">{roomState.users.length}</span>
				</div>
			</Tooltip>
		</div>
	)
}
