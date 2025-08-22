import type { MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => [
	{ title: 'Политика конфиденциальности • Akbuzat.net' },
	{ name: 'description', content: 'Политика конфиденциальности и обработки данных Akbuzat.net' },
]

export default function PrivacyPolicy() {
	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Хедер */}
				<div className="mb-8">
					<Link 
						to="/" 
						className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
					>
						← Вернуться на главную
					</Link>
					<h1 className="text-3xl font-bold text-gray-900">Политика конфиденциальности</h1>
					<p className="text-gray-600 mt-2">
						Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
					</p>
				</div>

				{/* Основной контент */}
				<div className="prose prose-gray max-w-none">
					<div className="space-y-6">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Принципы обработки данных</h2>
							<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
								<p className="text-green-800 font-medium">
									🔒 Приватность по дизайну: минимальная обработка данных, максимальная защита
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Какие данные мы обрабатываем</h2>
							<div className="space-y-3">
								<div>
									<h3 className="font-medium text-gray-900 mb-2">✅ Обрабатываемые данные:</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li><strong>Отображаемое имя:</strong> имя пользователя для показа участникам комнаты</li>
										<li><strong>Технические логи:</strong> временные логи соединения на время активной сессии</li>
										<li><strong>Метаданные сессии:</strong> информация о подключении (IP, время входа/выхода)</li>
										<li><strong>Настройки устройств:</strong> временные настройки микрофона/камеры в браузере</li>
									</ul>
								</div>

								<div>
									<h3 className="font-medium text-gray-900 mb-2">❌ НЕ обрабатываемые данные:</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li><strong>Аудио/видео контент:</strong> передается напрямую между участниками (P2P)</li>
										<li><strong>Текстовые сообщения:</strong> чат работает только во время сессии, не сохраняется</li>
										<li><strong>Файлы и медиа:</strong> любой обмен файлами происходит напрямую между участниками</li>
										<li><strong>Личные данные:</strong> номера телефонов, email, паспортные данные</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Цели обработки</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="border border-gray-200 rounded-lg p-4">
									<h3 className="font-medium text-gray-900 mb-2">Техническое обеспечение</h3>
									<ul className="text-sm text-gray-600 space-y-1">
										<li>• Установление WebRTC соединений</li>
										<li>• Маршрутизация через TURN серверы</li>
										<li>• Обеспечение качества связи</li>
									</ul>
								</div>
								<div className="border border-gray-200 rounded-lg p-4">
									<h3 className="font-medium text-gray-900 mb-2">Безопасность</h3>
									<ul className="text-sm text-gray-600 space-y-1">
										<li>• Предотвращение злоупотреблений</li>
										<li>• Диагностика технических проблем</li>
										<li>• Обеспечение стабильной работы</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Время хранения данных</h2>
							<div className="space-y-3 text-gray-700">
								<div className="flex items-start space-x-3">
									<span className="text-green-600 font-bold">⏱️</span>
									<div>
										<p><strong>Технические логи:</strong> автоматически удаляются через 24 часа после завершения сессии</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-green-600 font-bold">🔄</span>
									<div>
										<p><strong>Метаданные подключения:</strong> удаляются немедленно при отключении от комнаты</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-green-600 font-bold">💾</span>
									<div>
										<p><strong>Пользовательские настройки:</strong> хранятся только в локальном браузере</p>
									</div>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Передача третьим лицам</h2>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-blue-800">
									<strong>Никому не передаем:</strong> Данные не продаются, не передаются рекламным компаниям 
									или другим третьим лицам, кроме случаев, предусмотренных законом.
								</p>
								<p className="text-blue-700 text-sm mt-2">
									Техническое обеспечение: Cloudflare (инфраструктура), в соответствии с их политикой конфиденциальности.
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies и аналитика</h2>
							<div className="space-y-3 text-gray-700">
								<p>
									<strong>Минимальные технические cookies:</strong> Используются только для обеспечения работы сервиса 
									(имя пользователя, настройки подключения).
								</p>
								<p>
									<strong>Аналитика:</strong> Внешние системы аналитики (Google Analytics, Яндекс.Метрика и подобные) 
									не используются.
								</p>
								<p>
									<strong>Реклама:</strong> Рекламные сети и трекеры отсутствуют.
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Ваши права</h2>
							<div className="space-y-3 text-gray-700">
								<p>У вас есть право:</p>
								<ul className="list-disc list-inside ml-4 space-y-1">
									<li>Получить информацию о ваших данных (запрос на info@akbuzat.net)</li>
									<li>Запросить удаление ваших данных</li>
									<li>Отозвать согласие на обработку</li>
									<li>Подать жалобу в надзорные органы</li>
								</ul>
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
									<p className="text-yellow-800 text-sm">
										<strong>Ограничение прав:</strong> При конфликте прав пользователей и требований 
										соблюдения санкций/экспортного контроля — приоритет имеет соблюдение OFAC/EAR 
										и применимых ограничений.
									</p>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Юрисдикция и комплаенс</h2>
							<div className="space-y-3 text-gray-700">
								<p>
									<strong>Применимое право:</strong> Сервис соблюдает требования санкционного законодательства 
									США (OFAC), ЕС, Великобритании и экспортного контроля (EAR/ITAR).
								</p>
								<p>
									<strong>Ограничения доступа:</strong> Данные не обрабатываются для пользователей из 
									SDN-списка, заблокированных СМИ/организаций, регионов под полным эмбарго 
									(КНДР, Иран, Куба, Сирия, оккупированные территории Украины).
								</p>
								<p>
									<strong>Мониторинг соответствия:</strong> Мы можем приостановить обработку данных 
									или заблокировать доступ при подозрении на санкционные нарушения.
								</p>
								<p>
									<strong>Notice-and-takedown:</strong> Доступ отключается по обоснованному уведомлению 
									о санкционном нарушении без предварительного уведомления пользователя.
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Безопасность</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900 mb-2">🔐 Шифрование</h3>
									<ul className="text-sm text-gray-600 space-y-1">
										<li>• WebRTC E2E шифрование</li>
										<li>• MLS протокол защиты</li>
										<li>• TLS для всех соединений</li>
									</ul>
								</div>
								<div>
									<h3 className="font-medium text-gray-900 mb-2">🛡️ Защита данных</h3>
									<ul className="text-sm text-gray-600 space-y-1">
										<li>• Минимизация собираемых данных</li>
										<li>• Автоматическое удаление логов</li>
										<li>• Нет постоянного хранения контента</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Контакты</h2>
							<div className="bg-gray-50 rounded-lg p-4 space-y-2">
								<p className="text-gray-700">
									<strong>По вопросам обработки персональных данных:</strong>
								</p>
								<p>
									📧 Email: <a href="mailto:info@akbuzat.net?subject=Вопрос по персональным данным" 
										className="text-blue-600 hover:underline">info@akbuzat.net</a>
								</p>
								<p className="text-sm text-gray-600">
									Ответ в течение 30 дней с момента получения запроса
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Изменения политики</h2>
							<p className="text-gray-700">
								Политика конфиденциальности может быть обновлена. О существенных изменениях 
								будет сообщено на главной странице сервиса. Дата последнего обновления указана в начале документа.
							</p>
						</section>
					</div>
				</div>

				{/* Футер */}
				<div className="mt-12 pt-6 border-t border-gray-200 text-center">
					<Link to="/" className="text-blue-600 hover:underline">
						← Вернуться на главную
					</Link>
				</div>
			</div>
		</div>
	)
}
