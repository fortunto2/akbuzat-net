import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from './Button'

export interface EnsurePermissionsProps {
	children?: ReactNode
}

type PermissionState = 'denied' | 'granted' | 'prompt' | 'unable-to-determine'

// LocalStorage key to persist user's explicit denial, so we can
// keep showing the guidance banner across reloads until access is granted.
const MIC_DENIED_STORAGE_KEY = 'permissions:microphone:denied'

// Check if the browser is Safari on iOS
function isIOSSafari(): boolean {
	const userAgent = navigator.userAgent
	return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent)
}

// Detect if Lockdown Mode or similar restrictions might be active
function detectLockdownMode(): boolean {
	try {
		// Check for presence of APIs that are typically disabled in Lockdown Mode
		const hasWebGL = !!window.WebGLRenderingContext
		const hasWebRTC = !!window.RTCPeerConnection
		const hasServiceWorker = 'serviceWorker' in navigator
		const hasNotifications = 'Notification' in window
		const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		
		// If multiple APIs are missing, likely Lockdown Mode or similar restrictions
		const disabledAPIs = [
			!hasWebGL,
			!hasWebRTC,
			!hasServiceWorker,
			!hasNotifications,
			!hasMediaDevices
		].filter(Boolean).length
		
		// For Safari (iOS or macOS), if 3+ APIs are missing, likely Lockdown Mode
		if (/Safari/.test(navigator.userAgent) && !/Chrome|Edge/.test(navigator.userAgent)) {
			return disabledAPIs >= 3
		}
		
		// For any browser, if mediaDevices is missing along with other APIs, likely restrictions
		return !hasMediaDevices && disabledAPIs >= 2
	} catch {
		return false
	}
}

// Check if mediaDevices API is available
function isMediaDevicesAvailable(): boolean {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

async function getExistingPermissionState(): Promise<PermissionState> {
	// Check if mediaDevices API is available first
	if (!isMediaDevicesAvailable()) {
		// If mediaDevices is not available, likely Lockdown Mode or similar restrictions
		return 'denied'
	}

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
		let permissionStatus: PermissionStatus | null = null

		// Resolve current permission using Permissions API (when available)
		// and reconcile with locally persisted denial state.
		const init = async () => {
			const result = await getExistingPermissionState()

			// If user previously denied (we stored it) and the browser says
			// 'prompt' (typical after reload on Chrome when not "blocked"),
			// show persistent guidance until the user explicitly grants.
			const locallyDenied = localStorage.getItem(MIC_DENIED_STORAGE_KEY) === 'true'
			const effective = result === 'granted' ? 'granted' : locallyDenied ? 'denied' : result

			if (mountedRef.current) setPermissionState(effective)

			// Subscribe to permission changes when supported (Chrome/Edge)
			try {
				// Some browsers (Safari) throw here for media permissions
				permissionStatus = await navigator.permissions.query({ name: 'microphone' as any })
				permissionStatus.onchange = () => {
					const state = permissionStatus?.state ?? 'unable-to-determine'
					if (!mountedRef.current) return

					// If permission flipped to granted, clear our persisted flag
					if (state === 'granted') {
						localStorage.removeItem(MIC_DENIED_STORAGE_KEY)
					}
					setPermissionState(state as PermissionState)
				}
			} catch {
				// Ignore: not supported
			}
		}

		init()

		return () => {
			mountedRef.current = false
			if (permissionStatus) permissionStatus.onchange = null
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
								{isIOSSafari() 
									? "Обнаружен режим защиты iOS (Lockdown Mode). Этот режим блокирует доступ к камере и микрофону для безопасности."
									: "Обнаружены ограничения браузера. API камеры и микрофона недоступен."
								}
							</p>
							<div className="bg-red-50 border border-red-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-red-800 mb-2">
									🔒 Возможные причины:
								</p>
								<ul className="text-xs text-red-700 space-y-1 text-left">
									{isIOSSafari() ? (
										<>
											<li>• Режим защиты iOS активен</li>
											<li>• WebRTC и медиа-API заблокированы</li>
										</>
									) : (
										<>
											<li>• Режим защиты Safari на macOS</li>
											<li>• Ограничения безопасности браузера</li>
											<li>• Корпоративные политики безопасности</li>
										</>
									)}
									<li>• Это сделано для защиты от продвинутых атак</li>
								</ul>
							</div>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-blue-800 mb-2">
									🔧 Решения:
								</p>
								<ol className="text-xs text-blue-700 space-y-1 text-left">
									{isIOSSafari() ? (
										<>
											<li>1. Временно отключите режим защиты в Настройки → Конфиденциальность и защита → Режим защиты</li>
											<li>2. Или используйте другое устройство для видеозвонков</li>
										</>
									) : (
										<>
											<li>1. Проверьте настройки Safari → Конфиденциальность</li>
											<li>2. Отключите "Предотвращение межсайтового отслеживания" для этого сайта</li>
											<li>3. Попробуйте другой браузер (Chrome, Firefox)</li>
											<li>4. Обратитесь к администратору, если это рабочий компьютер</li>
										</>
									)}
									<li>{isIOSSafari() ? "3" : "5"}. Можете участвовать только в чате (без видео/аудио)</li>
								</ol>
							</div>
							<p className="text-xs text-gray-500">
								⚠️ {isIOSSafari() ? "Отключение режима защиты" : "Изменение настроек безопасности"} снижает защиту
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
						<div className="space-y-4 text-left">
							<p className="text-sm text-gray-700">
								Доступ к микрофону и камере заблокирован для этого сайта. Пожалуйста, разрешите доступ:
							</p>
							<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
								<p className="text-sm font-semibold text-orange-800 mb-2">Пошаговая инструкция:</p>
								<ol className="text-xs text-orange-700 space-y-1 list-decimal list-inside">
									<li>Нажмите на значок камеры/замка в адресной строке браузера.</li>
									<li>Выберите «Разрешить» для камеры и микрофона (или «Всегда разрешать»).</li>
									<li>Перезагрузите страницу, если требуется.</li>
								</ol>
							</div>
							<p className="text-xs text-gray-500">
								В Chrome/Edge значок находится справа от адреса. В Firefox — слева, в панели сайта. В Safari — Настройки для этого сайта.
							</p>
							<div>
								<Button
									onClick={() => {
										if (!isMediaDevicesAvailable()) {
											console.error('navigator.mediaDevices is not available')
											if (mountedRef.current) setPermissionState('denied')
											return
										}
										navigator.mediaDevices
											.getUserMedia({ video: true, audio: true })
											.then((ms) => {
												// User explicitly granted; clear persisted denial
												localStorage.removeItem(MIC_DENIED_STORAGE_KEY)
												if (mountedRef.current) setPermissionState('granted')
												ms.getTracks().forEach((t) => t.stop())
											})
											.catch((error) => {
												console.error('Permission error:', error)
												// Persist denial to keep banner visible across reloads
												localStorage.setItem(MIC_DENIED_STORAGE_KEY, 'true')
												if (mountedRef.current) setPermissionState('denied')
											})
								}}
								className="w-full py-3 text-sm font-semibold mt-2"
							>
								🔁 Попробовать запросить доступ снова
							</Button>
							</div>
						</div>
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
								{isIOSSafari() ? "Режим защиты обнаружен" : "Ограничения браузера"}
							</h1>
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
								<p className="text-sm text-red-800 mb-2">
									⚠️ {isIOSSafari() ? "Режим защиты iOS" : "Браузер"} блокирует камеру и микрофон
								</p>
								<p className="text-xs text-red-700">
									{isIOSSafari() 
										? "WebRTC и медиа-устройства недоступны в режиме защиты для безопасности активистов и журналистов."
										: "API navigator.mediaDevices недоступен. Возможно активны ограничения безопасности или корпоративные политики."
									}
								</p>
							</div>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
								<p className="text-sm font-semibold text-blue-800 mb-2">
									Варианты решения:
								</p>
								<ul className="text-xs text-blue-700 space-y-1 text-left">
									{isIOSSafari() ? (
										<>
											<li>• Временно отключить режим защиты (снижает безопасность)</li>
											<li>• Использовать другое устройство</li>
										</>
									) : (
										<>
											<li>• Проверить настройки конфиденциальности Safari</li>
											<li>• Попробовать Chrome или Firefox</li>
											<li>• Обратиться к системному администратору</li>
										</>
									)}
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
								// Double-check that mediaDevices is available before calling
								if (!isMediaDevicesAvailable()) {
									console.error('navigator.mediaDevices is not available')
									if (mountedRef.current) setPermissionState('denied')
									return
								}

								navigator.mediaDevices
									.getUserMedia({
										video: true,
										audio: true,
									})
									.then((ms) => {
										// Clear persisted denial on success
										localStorage.removeItem(MIC_DENIED_STORAGE_KEY)
										if (mountedRef.current) setPermissionState('granted')
										ms.getTracks().forEach((t) => t.stop())
									})
									.catch((error) => {
										console.error('Permission error:', error)
										// Persist denial to keep banner visible across reloads
										localStorage.setItem(MIC_DENIED_STORAGE_KEY, 'true')
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
