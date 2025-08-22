import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from './Button'

export interface EnsurePermissionsProps {
	children?: ReactNode
}

type PermissionState = 'denied' | 'granted' | 'prompt' | 'unable-to-determine'

// Check if the browser is Safari on iOS
function isIOSSafari(): boolean {
	const userAgent = navigator.userAgent
	return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent)
}

// Detect if iOS Lockdown Mode might be active
function detectLockdownMode(): boolean {
	try {
		// Lockdown Mode disables many web APIs
		// Check for presence of APIs that are typically disabled
		const hasWebGL = !!window.WebGLRenderingContext
		const hasWebRTC = !!window.RTCPeerConnection
		const hasServiceWorker = 'serviceWorker' in navigator
		const hasNotifications = 'Notification' in window
		
		// If multiple APIs are missing on iOS, likely Lockdown Mode
		if (isIOSSafari()) {
			const disabledAPIs = [
				!hasWebGL,
				!hasWebRTC,
				!hasServiceWorker,
				!hasNotifications
			].filter(Boolean).length
			
			return disabledAPIs >= 2
		}
		
		return false
	} catch {
		return false
	}
}

async function getExistingPermissionState(): Promise<PermissionState> {
	// Safari on iOS doesn't support navigator.permissions.query for media devices
	// We need to try a different approach
	if (isIOSSafari()) {
		// For iOS Safari, we can't reliably check permission state without triggering getUserMedia
		// So we assume 'prompt' to force user interaction
		return 'prompt'
	}

	try {
		const query = await navigator.permissions.query({
			name: 'microphone' as any,
		})
		return query.state
	} catch (error) {
		// Fallback for browsers that don't support permissions API
		return 'prompt'
	}
}

export function EnsurePermissions(props: EnsurePermissionsProps) {
	const [permissionState, setPermissionState] =
		useState<PermissionState | null>(null)

	const mountedRef = useRef(true)

	useEffect(() => {
		getExistingPermissionState().then((result) => {
			if (mountedRef.current) setPermissionState(result)
		})
		return () => {
			mountedRef.current = false
		}
	}, [])

	if (permissionState === null) return null

	if (permissionState === 'denied') {
		const isMobile = isIOSSafari() || /Android/.test(navigator.userAgent)
		const isLockdownMode = detectLockdownMode()
		
		return (
			<div className="grid items-center h-full">
				<div className="mx-auto space-y-4 max-w-80 text-center">
					<div className="text-4xl mb-4">{isLockdownMode ? "🛡️" : "🚫"}</div>
					<h1 className="text-2xl font-bold">
						{isLockdownMode ? "Режим защиты активен" : "Доступ запрещен"}
					</h1>
					{isLockdownMode ? (
						<div className="space-y-4">
							<p className="text-sm text-gray-600">
								Обнаружен режим защиты iOS (Lockdown Mode). Этот режим блокирует доступ к камере и микрофону для безопасности.
							</p>
							<div className="bg-red-50 border border-red-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-red-800 mb-2">
									🔒 Режим защиты и веб-камеры:
								</p>
								<ul className="text-xs text-red-700 space-y-1 text-left">
									<li>• Режим защиты полностью блокирует WebRTC</li>
									<li>• Камера и микрофон недоступны для веб-сайтов</li>
									<li>• Это сделано для защиты от продвинутых атак</li>
								</ul>
							</div>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-blue-800 mb-2">
									🔧 Решения:
								</p>
								<ol className="text-xs text-blue-700 space-y-1 text-left">
									<li>1. Временно отключите режим защиты в Настройки → Конфиденциальность и защита → Режим защиты</li>
									<li>2. Или используйте другое устройство для видеозвонков</li>
									<li>3. Можете участвовать только в чате (без видео/аудио)</li>
								</ol>
							</div>
							<p className="text-xs text-gray-500">
								⚠️ Отключение режима защиты снижает безопасность
							</p>
						</div>
					) : isMobile ? (
						<div className="space-y-4">
							<p className="text-sm text-gray-600">
								Для работы приложения необходим доступ к камере и микрофону.
							</p>
							<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-orange-800 mb-2">
									Как разрешить доступ на iPhone/iPad:
								</p>
								<ol className="text-xs text-orange-700 space-y-1 text-left">
									<li>1. Откройте Настройки → Safari</li>
									<li>2. Найдите раздел "Камера" и "Микрофон"</li>
									<li>3. Разрешите доступ для этого сайта</li>
									<li>4. Перезагрузите страницу</li>
								</ol>
							</div>
							<p className="text-xs text-gray-500">
								Или попробуйте перезагрузить страницу и разрешить доступ заново
							</p>
						</div>
					) : (
						<p>
							Вам необходимо зайти в настройки браузера и вручную разрешить доступ к камере и микрофону.
						</p>
					)}
				</div>
			</div>
		)
	}

	if (permissionState === 'prompt') {
		const isMobile = isIOSSafari() || /Android/.test(navigator.userAgent)
		const isLockdownMode = detectLockdownMode()
		
		return (
			<div className="grid items-center h-full">
				<div className="mx-auto max-w-80 text-center">
					{isLockdownMode ? (
						<div className="space-y-6">
							<div className="text-6xl mb-4">🛡️</div>
							<h1 className="text-xl font-bold mb-4 text-red-600">
								Режим защиты обнаружен
							</h1>
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
								<p className="text-sm text-red-800 mb-2">
									⚠️ Режим защиты iOS блокирует камеру и микрофон
								</p>
								<p className="text-xs text-red-700">
									WebRTC и медиа-устройства недоступны в режиме защиты для безопасности активистов и журналистов.
								</p>
							</div>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
								<p className="text-sm font-semibold text-blue-800 mb-2">
									Варианты решения:
								</p>
								<ul className="text-xs text-blue-700 space-y-1 text-left">
									<li>• Временно отключить режим защиты (снижает безопасность)</li>
									<li>• Использовать другое устройство</li>
									<li>• Участвовать только в текстовом чате</li>
								</ul>
							</div>
						</div>
					) : isMobile ? (
						<div className="space-y-6">
							<div className="text-6xl mb-4">📱</div>
							<h1 className="text-xl font-bold mb-4">
								Разрешите доступ к камере и микрофону
							</h1>
							<p className="mb-6 text-sm text-gray-600">
								{isIOSSafari() 
									? "На iPhone/iPad нажмите кнопку ниже и разрешите доступ к камере и микрофону в появившемся окне браузера."
									: "Нажмите кнопку ниже и разрешите доступ к камере и микрофону в появившемся окне браузера."
								}
							</p>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
								<p className="text-sm text-blue-800">
									💡 Если окно с запросом разрешений не появилось, проверьте:
								</p>
								<ul className="text-xs text-blue-700 mt-2 space-y-1 text-left">
									<li>• Используете ли вы Safari (рекомендуется)</li>
									<li>• Открыт ли сайт по HTTPS</li>
									<li>• Не заблокированы ли всплывающие окна</li>
									<li>• Не включен ли режим защиты iOS</li>
								</ul>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<p className="mb-8">
								Для использования Orange Meets необходимо разрешить доступ к камере и микрофону. Вам будет показан запрос на доступ.
							</p>
						</div>
					)}
					{!isLockdownMode && (
						<Button
							onClick={() => {
								navigator.mediaDevices
									.getUserMedia({
										video: true,
										audio: true,
									})
									.then((ms) => {
										if (mountedRef.current) setPermissionState('granted')
										ms.getTracks().forEach((t) => t.stop())
									})
									.catch((error) => {
										console.error('Permission error:', error)
										if (mountedRef.current) setPermissionState('denied')
									})
							}}
							className="w-full py-3 text-lg font-semibold"
						>
							🎥 Разрешить доступ
						</Button>
					)}
				</div>
			</div>
		)
	}

	return props.children
}
