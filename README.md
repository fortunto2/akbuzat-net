# Akbuzat.net

🔒 **Безопасные видеозвонки для друзей**

Некоммерческий проект для защищенных видеозвонков с друзьями и семьей. 

**Форк проекта [Cloudflare Orange](https://github.com/cloudflare/orange)** с дополнительными возможностями и русификацией.

> 📋 **Связь с оригиналом**: Этот проект является форком Cloudflare Orange. Мы регулярно синхронизируемся с upstream для получения обновлений безопасности и новых функций.

## ✨ Особенности

- 🚀 **Без регистрации** - создавайте комнаты мгновенно
- 🔐 **E2E шифрование (MLS)** - ваши разговоры защищены сквозным шифрованием
- ⚡ **Низкая задержка** - качественная связь через Cloudflare Realtime SFU
- 🤖 **ИИ-помощник** - пригласите ИИ в разговор (OpenAI Realtime API)
- 🌐 **P2P/SFU hybrid** - автоматический выбор оптимального подключения
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔒 **Safety Number** - верификация отсутствия перехвата
- ⏰ **TTL ссылки** - комнаты с ограниченным временем жизни
- 🛡️ **TURN over TLS** - защищенная передача через порты 443/5349

## 🚀 Быстрый старт

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/fortunto2/akbuzat-net.git
cd akbuzat-net
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте Cloudflare сервисы:
   - Перейдите в Dashboard → Realtime → Serverless SFU
   - Создайте SFU App (получите CALLS_APP_ID, CALLS_APP_SECRET)
   - Перейдите в Dashboard → Realtime → TURN Server
   - Создайте TURN App (получите TURN_SERVICE_ID, TURN_SERVICE_TOKEN)

4. Создайте файл `.dev.vars` с вашими переменными:
```bash
CALLS_APP_ID=your_app_id_here
CALLS_APP_SECRET=your_secret_here
TURN_SERVICE_ID=your_turn_service_id_here
TURN_SERVICE_TOKEN=your_turn_token_here
```

5. Запустите разработку:
```bash
npm run dev
```

Откройте http://127.0.0.1:8787

### Деплой

1. Войдите в Wrangler:
```bash
wrangler login
```

2. Обновите `CALLS_APP_ID` и `TURN_SERVICE_ID` в `wrangler.toml`

3. Установите секреты:
```bash
wrangler secret put CALLS_APP_SECRET
wrangler secret put TURN_SERVICE_TOKEN
```

4. Задеплойте:
```bash
npm run deploy
```

## 🛠 Технологии

- **Frontend**: React, Remix, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers, Durable Objects
- **WebRTC**: Cloudflare Calls API (Realtime SFU)
- **ИИ**: OpenAI Realtime API для голосового ассистента
- **Шифрование**: MLS (Message Layer Security) для E2E защиты
- **Сеть**: TURN over TLS (порты 443/5349), P2P fallback
- **Инфраструктура**: Cloudflare Edge, Anycast routing

## 📋 Переменные окружения

### Обязательные
- `CALLS_APP_ID` - ID приложения Cloudflare Calls
- `CALLS_APP_SECRET` - Секрет приложения Cloudflare Calls

### Опциональные
- `TURN_SERVICE_ID` - ID TURN сервиса Cloudflare
- `TURN_SERVICE_TOKEN` - Токен TURN сервиса
- `OPENAI_MODEL_ENDPOINT` - Endpoint для OpenAI Realtime API
- `OPENAI_API_TOKEN` - API токен OpenAI
- `MAX_WEBCAM_BITRATE` - Максимальный битрейт веб-камеры (по умолчанию: 800000 = 0.8 Mbps)
- `MAX_WEBCAM_FRAMERATE` - Максимальный FPS веб-камеры (по умолчанию: 30)
- `MAX_WEBCAM_QUALITY_LEVEL` - Максимальное разрешение (по умолчанию: 720p)
- `EXPERIMENTAL_SIMULCAST_ENABLED` - Включить адаптивное качество видео (по умолчанию: true)
- `E2EE_ENABLED` - Включить End-to-End шифрование (по умолчанию: true)

## 🔧 Настройка продакшн среды

### Cloudflare Dashboard
1. **Включите Cloudflare Realtime**: Dashboard → Realtime → Serverless SFU
2. **Настройте TURN сервис**: Dashboard → Realtime → TURN Server
3. **Привяжите домен**: DNS настройки с Proxy = ON
4. **Безопасность**: 
   - Edge Certificates → отключите ECH (Encrypted ClientHello)
   - Автоматические заголовки безопасности (см. раздел Безопасность)

### Wrangler конфигурация
```toml
name = "akbuzat-net"
compatibility_date = "2024-10-07"
main = "./build/index.js"
compatibility_flags = ["nodejs_compat"]

[vars]
CALLS_APP_ID = "your_calls_app_id"
TURN_SERVICE_ID = "your_turn_service_id"

[[durable_objects.bindings]]
name = "rooms"
class_name = "ChatRoom"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["ChatRoom"]
```

### ICE серверы приоритет
1. `turns:turn.cloudflare.com:5349?transport=tcp` (высший приоритет)
2. `turns:turn.cloudflare.com:443?transport=tcp`
3. `stun:stun.cloudflare.com:3478`

## 🔧 Команды

- `npm run dev` - Запуск разработки
- `npm run build` - Сборка проекта
- `npm run deploy` - Деплой в Cloudflare
- `npm run test` - Запуск тестов
- `npm run typecheck` - Проверка типов

## 📊 Требования к системе

### Node.js версия
- **Минимум**: Node.js 20+
- **Рекомендуется**: Последняя LTS версия

### Cloudflare план
- **Workers**: Unlimited план для Durable Objects
- **Calls**: Pay-as-you-go тарификация
- **Bandwidth**: ~800 ГБ/месяц лимит для уведомлений

## 🛡️ Безопасность

### Заголовки безопасности
Автоматически добавляются ко всем HTTP запросам:
- `X-Frame-Options: DENY` - защита от clickjacking атак
- `Referrer-Policy: strict-origin-when-cross-origin` - контроль referrer информации
- `Cross-Origin-Resource-Policy: same-origin` - защита от cross-origin атак
- `Permissions-Policy` - ограничение доступа к устройствам (камера только для текущего сайта)

### Исключения для WebRTC
- WebSocket соединения исключены из обработки заголовков для совместимости
- CSP (Content Security Policy) отключен для предотвращения блокировки WebRTC функций
- TURN over TLS на портах 443/5349 для обхода корпоративных файрволов

## 🧪 Тестирование

### Локальное тестирование
```bash
npm run test          # Unit тесты
npm run typecheck     # Проверка типов TypeScript
```

### WebRTC отладка
- Откройте `chrome://webrtc-internals` для мониторинга соединений
- Проверьте `iceServers` с Cloudflare TURN серверами  
- Ищите `candidateType=relay` для подтверждения TURN usage
- Статус соединения: `ICE connection state: completed`

### Тестирование безопасности
- Проверьте заголовки: `curl -I https://akbuzat.net`
- Аудит безопасности: [securityheaders.com](https://securityheaders.com/?q=akbuzat.net)

### Проверка E2E шифрования
**В браузере Chrome:**
1. **Developer Tools** (F12) → **Console** - ищите сообщения:
   ```
   🔐 E2EE enabled: true
   🔑 Safety Number: 12345-67890-...
   📬 sending e2eeMlsMessage to peers
   📨 incoming e2eeMlsMessage from peer
   ```

2. **Проверка переменных** - в Console введите:
   ```javascript
   window.ENV.E2EE_ENABLED  // должно быть "true"
   ```

3. **WebRTC Internals** - откройте `chrome://webrtc-internals` и ищите:
   ```
   e2ee-enabled: true
   mls-protocol: active
   encrypted-streams: true
   ```

4. **В интерфейсе комнаты** должен отображаться:
   - 🔐 **Safety Number** (номер безопасности для верификации)
   - 🔒 **Индикатор E2E шифрования**

**Симулкаст и качество видео:**
- **Network tab** → WebSocket → ищите multiple video streams (240p, 480p, 720p)
- **WebRTC Stats** → проверьте adaptive bitrate switching

## 🔄 Синхронизация с upstream

Этот проект является форком Cloudflare Orange. Для получения обновлений:

```bash
# Получить последние изменения из оригинального репозитория
git fetch upstream

# Посмотреть различия с основной веткой
git log HEAD..upstream/main --oneline

# Слить изменения из upstream (осторожно!)
git merge upstream/main

# Или создать новую ветку для интеграции изменений
git checkout -b sync-upstream
git merge upstream/main
```

### 📊 Статус относительно upstream
- **Последняя синхронизация**: Проверьте коммиты `git log --oneline upstream/main`
- **Отслеживание изменений**: Используйте GitHub для мониторинга [новых релизов](https://github.com/cloudflare/orange/releases)

## 🤝 Вклад в проект

Проект создан для друзей и семьи. Если хотите внести свой вклад:

1. Форкните репозиторий
2. Создайте ветку для фичи
3. Внесите изменения
4. Создайте Pull Request

### Основные подводные камни
- **Node.js**: Обязательно используйте версию 20+
- **Durable Objects**: Используйте `new_sqlite_classes`, не `new_classes`
- **App ID**: Создавайте именно SFU приложение в Dashboard
- **Пути**: Правильные пути `/realtime/sfu/overview` и `/realtime/turn/overview`
- **WebSocket + безопасность**: CSP может блокировать WebSocket соединения
- **Upstream синхронизация**: Проверяйте изменения перед слиянием с upstream

## 📄 Лицензия

Apache License 2.0 - см. файл [LICENSE](LICENSE)

Проект основан на [Cloudflare Orange](https://github.com/cloudflare/orange) под Apache License 2.0.

## 🙏 Благодарности

- [Cloudflare Orange](https://github.com/cloudflare/orange) - оригинальный проект
- [Cloudflare Calls](https://developers.cloudflare.com/calls/) - WebRTC API
- [OpenAI](https://openai.com/) - ИИ интеграция

---

**Сделано с ❤️ для друзей**

📧 Вопросы и предложения: [info@akbuzat.net](mailto:info@akbuzat.net)