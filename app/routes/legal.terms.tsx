import type { MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => [
	{ title: 'Правила использования • Akbuzat.net' },
	{ name: 'description', content: 'Правила использования сервиса Akbuzat.net' },
]

export default function TermsOfService() {
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
					<h1 className="text-3xl font-bold text-gray-900">Правила использования</h1>
					<p className="text-gray-600 mt-2">
						Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
					</p>
				</div>

				{/* Основной контент */}
				<div className="prose prose-gray max-w-none">
					<div className="space-y-6">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">О проекте</h2>
							<p className="text-gray-700 leading-relaxed">
								Akbuzat.net — некоммерческий проект для приватных видеозвонков малых групп 
								(друзья, семья). Сервис основан на открытом исходном коде 
								<a href="https://github.com/cloudflare/orange" className="text-blue-600 hover:underline ml-1">
									Cloudflare Orange
								</a>.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Назначение</h2>
							<div className="space-y-2 text-gray-700">
								<p>✅ <strong>Предназначен для:</strong> Личных видеозвонков с друзьями и семьей</p>
								<p>❌ <strong>НЕ предназначен для:</strong></p>
								<ul className="list-disc list-inside ml-4 space-y-1">
									<li>Коммерческого использования компаниями в РФ</li>
									<li>Деловой переписки организаций</li>
									<li>Распространения противоправного контента</li>
									<li>Нарушения авторских прав третьих лиц</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Ограничения и ответственность</h2>
							<div className="space-y-3 text-gray-700">
								<p>
									<strong>Запрещенный контент:</strong> При получении уведомления о размещении 
									противоправного контента доступ к комнате может быть ограничен или заблокирован 
									(notice-and-takedown процедура).
								</p>
								<p>
									<strong>Санкционные нарушения:</strong> Отключаем сеанс/ссылку по обоснованному 
									уведомлению о санкционном нарушении или подозрении на обход ограничений.
								</p>
								<p>
									<strong>Запрет обхода:</strong> Запрещено использование VPN, прокси или иных методов 
									сокрытия (obfuscation/ротации) для обхода санкционных ограничений или правил сервиса.
								</p>
								<p>
									<strong>Гарантии:</strong> Сервис предоставляется "как есть", без гарантий доступности. 
									Работа может быть ограничена или прекращена в любое время, включая спорные случаи 
									с санкционным комплаенсом.
								</p>
								<p>
									<strong>Техническая поддержка:</strong> Предоставляется в добровольном порядке, 
									без гарантий сроков ответа.
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Sanctions & Export Compliance</h2>
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
								<p className="text-yellow-800 text-sm leading-relaxed">
									<strong>Sanctions & Export Compliance:</strong> Сервис предоставляется при условии соблюдения 
									применимых санкционных режимов США, ЕС, Великобритании и др. Сервис не доступен лицам и 
									организациям, находящимся под санкциями США (включая SDN-перечень), а также пользователям, 
									находящимся в регионах с комплексными ограничениями (включая КНДР, Иран, Кубу, Сирию, 
									Крым/Донецкую/Луганскую/Херсонскую/Запорожскую области Украины).
								</p>
							</div>
							<div className="space-y-3 text-gray-700">
								<p>
									<strong>Для российских пользователей:</strong> сервис предназначен исключительно для обмена 
									персональными коммуникациями; мы не предоставляем доступ перечисленным в санкциях 
									СМИ/организациям и не поддерживаем коммерческое использование, подпадающее под ограничения.
								</p>
								<p>
									<strong>Право блокировки:</strong> Мы оставляем за собой право блокировать доступ при 
									подозрении на нарушение экспортного контроля или содействие его обходу.
								</p>
								<p>
									<strong>Приоритет комплаенс:</strong> При конфликте прав пользователей и требований 
									соблюдения санкций — приоритет имеет соблюдение OFAC/EAR и применимых ограничений.
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Соблюдение законодательства РФ</h2>
							<p className="text-gray-700 leading-relaxed">
								Сервис не предназначен для деловых коммуникаций организаций в РФ в контексте 
								ограничений на использование иностранных мессенджеров, действующих с 01.06.2025. 
								Пользователи самостоятельно несут ответственность за соблюдение применимого законодательства.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Контакты</h2>
							<div className="space-y-2 text-gray-700">
								<p>
									<strong>Вопросы по злоупотреблениям:</strong>{' '}
									<a href="mailto:info@akbuzat.net?subject=Сообщить о нарушении" 
										className="text-blue-600 hover:underline">
										info@akbuzat.net
									</a>
								</p>
								<p>
									<strong>Общие вопросы:</strong>{' '}
									<a href="mailto:info@akbuzat.net" className="text-blue-600 hover:underline">
										info@akbuzat.net
									</a>
								</p>
								<p>
									<strong>Исходный код:</strong>{' '}
									<a href="https://github.com/fortunto2/akbuzat-net" 
										className="text-blue-600 hover:underline">
										GitHub
									</a>
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Изменения</h2>
							<p className="text-gray-700 leading-relaxed">
								Правила могут быть изменены в любое время. Продолжение использования сервиса 
								после внесения изменений означает согласие с новыми условиями.
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
