# Durable Objects

## ChatRoom

Основной Durable Object для управления видеоконференц-комнатами. Обрабатывает подключения пользователей, трансляцию сообщений и состояния участников.

## RateLimiter

Durable Object для ограничения скорости запросов и предотвращения злоупотреблений.

### Функции RateLimiter:

1. **Ограничение создания комнат** (`/check-room-creation`)

   - Лимит: 5 комнат в час на IP
   - Защищает от спама создания комнат

2. **Ограничение подключений** (`/check-connection`)

   - Лимит: 20 подключений за 10 минут на IP
   - Защищает от DDoS атак на WebSocket соединения

3. **Общий API rate limit** (`/check-api-rate`)

   - Лимит: 100 запросов в минуту на IP
   - Общая защита от злоупотреблений API

4. **Ограничение времени звонков** (`/check-call-duration`)

   - Лимит: 1 час максимум на звонок
   - Автоматическое завершение звонков при превышении лимита
   - Предупреждения за 5 минут до окончания

5. **Автоочистка старых комнат** (`/cleanup-old-rooms`)
   - Комнаты старше 2 часов удаляются принудительно
   - Пустые комнаты удаляются через 30 минут
   - Запускается каждые 15 минут через cron

### Использование:

```typescript
import {
	checkRoomCreationLimit,
	checkConnectionLimit,
	checkCallDuration,
	cleanupOldRooms,
	markRoomActive,
	markRoomEmpty,
	endCall,
	withRateLimit,
} from '~/utils/rateLimiter'

// Проверка при создании комнаты
const roomLimit = await checkRoomCreationLimit(env, request)
if (!roomLimit.allowed) {
	return new Response('Too many rooms created', { status: 429 })
}

// Проверка при подключении к комнате
const connectionLimit = await checkConnectionLimit(env, request)
if (!connectionLimit.allowed) {
	return new Response('Too many connections', { status: 429 })
}

// Проверка времени звонка
const durationCheck = await checkCallDuration(env, roomId)
if (!durationCheck.allowed) {
	return new Response('Call time limit exceeded', { status: 429 })
}

// Отметить комнату как активную
await markRoomActive(env, roomId)

// Завершить звонок принудительно
await endCall(env, roomId)

// Очистка старых комнат (cron job)
const cleanup = await cleanupOldRooms(env)
console.log(`Cleaned ${cleanup.cleaned} rooms`)

// Middleware для API routes
return withRateLimit(env, request, async () => {
	// ваш код API
})
```

### Настройка лимитов:

Лимиты можно изменить в файле `RateLimiter.server.ts`:

- `limit` - количество запросов
- `windowMs` - окно времени в миллисекундах

### Технические детали:

- Использует sliding window алгоритм
- Хранение в Durable Object Storage
- Автоочистка устаревших записей
- Отдельные лимиты по IP адресам
