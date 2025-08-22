# Akbuzat.net

🔒 **Безопасные видеозвонки для друзей**

Некоммерческий проект для защищенных видеозвонков с друзьями и семьей. Основан на [Cloudflare Orange](https://github.com/cloudflare/orange).

## ✨ Особенности

- 🚀 **Без регистрации** - создавайте комнаты мгновенно
- 🔐 **E2E шифрование** - ваши разговоры защищены
- ⚡ **Низкая задержка** - качественная связь через Cloudflare
- 🤖 **ИИ-помощник** - пригласите ИИ в разговор
- 🌐 **P2P соединения** - прямое подключение между участниками
- 📱 **Адаптивный дизайн** - работает на всех устройствах

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

3. Создайте файл `.dev.vars` с вашими Cloudflare Calls переменными:
```bash
CALLS_APP_ID=your_app_id_here
CALLS_APP_SECRET=your_secret_here
TURN_SERVICE_ID=your_turn_service_id_here
TURN_SERVICE_TOKEN=your_turn_token_here
```

4. Запустите разработку:
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
- **WebRTC**: Cloudflare Calls API
- **ИИ**: OpenAI Realtime API
- **Шифрование**: MLS (Message Layer Security)

## 📋 Переменные окружения

### Обязательные
- `CALLS_APP_ID` - ID приложения Cloudflare Calls
- `CALLS_APP_SECRET` - Секрет приложения Cloudflare Calls

### Опциональные
- `TURN_SERVICE_ID` - ID TURN сервиса Cloudflare
- `TURN_SERVICE_TOKEN` - Токен TURN сервиса
- `OPENAI_MODEL_ENDPOINT` - Endpoint для OpenAI Realtime API
- `OPENAI_API_TOKEN` - API токен OpenAI
- `MAX_WEBCAM_BITRATE` - Максимальный битрейт веб-камеры (по умолчанию: 1200000)
- `MAX_WEBCAM_FRAMERATE` - Максимальный FPS веб-камеры (по умолчанию: 24)
- `MAX_WEBCAM_QUALITY_LEVEL` - Максимальное разрешение (по умолчанию: 1080)

## 🔧 Команды

- `npm run dev` - Запуск разработки
- `npm run build` - Сборка проекта
- `npm run deploy` - Деплой в Cloudflare
- `npm run test` - Запуск тестов
- `npm run typecheck` - Проверка типов

## 🤝 Вклад в проект

Проект создан для друзей и семьи. Если хотите внести свой вклад:

1. Форкните репозиторий
2. Создайте ветку для фичи
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🙏 Благодарности

- [Cloudflare Orange](https://github.com/cloudflare/orange) - оригинальный проект
- [Cloudflare Calls](https://developers.cloudflare.com/calls/) - WebRTC API
- [OpenAI](https://openai.com/) - ИИ интеграция

---

**Сделано с ❤️ для друзей**