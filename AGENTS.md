# AGENTS.md

## Project Overview

Akbuzat.net is a secure video calling platform built as a fork of Cloudflare Orange. It's a non-commercial project for protected video calls with friends and family, featuring E2E encryption, AI assistant integration, and WebRTC capabilities through Cloudflare infrastructure.

**Key Architecture:**

- Frontend: React + Remix + TypeScript + Tailwind CSS
- Backend: Cloudflare Workers + Durable Objects
- WebRTC: Cloudflare Calls API (Realtime SFU) - Legacy implementation
- Encryption: MLS (Message Layer Security) for E2E protection
- AI: OpenAI Realtime API for voice assistant
- Network: TURN over TLS (ports 443/5349), SFU-based architecture

**Important**: This project uses legacy Cloudflare Calls API. For new projects, consider [Cloudflare RealtimeKit](https://docs.realtime.cloudflare.com/) which provides comprehensive SDKs with UI Kit components and better developer experience.

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build project
npm run build

# Deploy to Cloudflare
npm run deploy

# Run tests
npm run test

# Type checking
npm run typecheck
```

## Development Environment

### Required Node.js Version

- **Minimum**: Node.js 20+
- **Recommended**: Latest LTS version

### Environment Setup

1. **Cloudflare Services Configuration (Legacy Calls API):**

   - Dashboard → Realtime → Serverless SFU (get CALLS_APP_ID, CALLS_APP_SECRET)
   - Dashboard → Realtime → TURN Server (get TURN_SERVICE_ID, TURN_SERVICE_TOKEN)
   - **Note**: This uses legacy Calls API. New projects should use [RealtimeKit](https://docs.realtime.cloudflare.com/) instead

#### Legacy Calls API Details

This project uses the older [Cloudflare Calls API](https://developers.cloudflare.com/api/resources/calls/) which has two main components:

**SFU (Selective Forwarding Unit):**

- **API Endpoint**: `POST /accounts/{account_id}/calls/apps`
- **Purpose**: Creates unique environment where each Session can access all Tracks within the app
- **Authentication**: Requires API Token with "Calls Write" permissions
- **Response**: Returns `uid` (CALLS_APP_ID) and `secret` (CALLS_APP_SECRET)
- **Documentation**: [Create SFU App](https://developers.cloudflare.com/api/resources/calls/subresources/sfu/methods/create/)

```bash
# Create SFU App example
curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/calls/apps \
  -H 'Content-Type: application/json' \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -d '{"name": "production-realtime-app"}'
```

**TURN (Traversal Using Relays around NAT):**

- **API Endpoint**: `POST /accounts/{account_id}/calls/turn_keys`
- **Purpose**: Creates TURN keys for NAT traversal and relay services
- **Response**: Returns `key` (TURN_SERVICE_ID) and credentials
- **Documentation**: [TURN Keys Management](https://developers.cloudflare.com/api/resources/calls/subresources/turn/)

```bash
# Create TURN Key example
curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/calls/turn_keys \
  -H 'Content-Type: application/json' \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -d '{"name": "production-turn-key"}'
```

2. **Create `.dev.vars` file:**

```bash
CALLS_APP_ID=your_app_id_here
CALLS_APP_SECRET=your_secret_here
TURN_SERVICE_ID=your_turn_service_id_here
TURN_SERVICE_TOKEN=your_turn_token_here
```

3. **Development server:** `npm run dev` → http://127.0.0.1:8787

### Deployment Setup

1. Login to Wrangler: `wrangler login`
2. Update `CALLS_APP_ID` and `TURN_SERVICE_ID` in `wrangler.toml`
3. Set secrets:

```bash
wrangler secret put CALLS_APP_SECRET
wrangler secret put TURN_SERVICE_TOKEN
```

## Code Style & Architecture

### TypeScript Configuration

- Strict mode enabled
- All comments and code in English (even if communication is in Russian)
- Prefer functional patterns where possible

### Key File Structure

```
app/
├── components/          # React components
├── durableObjects/      # ChatRoom.server.ts, RateLimiter.server.ts
├── hooks/              # Custom React hooks
├── routes/             # Remix routes
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Tailwind CSS
```

### Important Architecture Components

- **ChatRoom Durable Object**: Manages room state and WebSocket connections
- **RateLimiter Durable Object**: Rate limiting for API calls
- **PartyTracks**: WebRTC connection management through Cloudflare Calls
- **E2EE**: End-to-end encryption using MLS protocol
- **SecurityStatusPanel**: Shows connection type (P2P/SFU) and encryption status

## Environment Variables

### Required (Legacy Calls API)

- `CALLS_APP_ID` - Cloudflare Calls application ID (from SFU app creation response: `result.uid`)
- `CALLS_APP_SECRET` - Cloudflare Calls application secret (from SFU app creation response: `result.secret`)

### Optional

- `TURN_SERVICE_ID` - Cloudflare TURN service ID (from TURN key creation response: `result.key`)
- `TURN_SERVICE_TOKEN` - Cloudflare TURN service token (secret, from TURN key creation)
- `OPENAI_MODEL_ENDPOINT` - OpenAI Realtime API endpoint
- `OPENAI_API_TOKEN` - OpenAI API token (secret)
- `MAX_WEBCAM_BITRATE` - Default: 800000 (0.8 Mbps)
- `MAX_WEBCAM_FRAMERATE` - Default: 30
- `MAX_WEBCAM_QUALITY_LEVEL` - Default: 720
- `EXPERIMENTAL_SIMULCAST_ENABLED` - Default: true
- `E2EE_ENABLED` - Default: true

## Testing Instructions

### Local Testing

```bash
npm run test          # Unit tests
npm run typecheck     # TypeScript type checking
```

### WebRTC Debugging

- Open `chrome://webrtc-internals` for connection monitoring
- Check `iceServers` configuration with Cloudflare TURN servers
- Look for `candidateType=relay` to confirm TURN usage
- Connection status should show: `ICE connection state: completed`

### E2E Encryption Testing

1. **Browser Console** - Look for messages:

```
🔐 E2EE enabled: true
🔑 Safety Number: 12345-67890-...
📬 sending e2eeMlsMessage to peers
📨 incoming e2eeMlsMessage from peer
```

2. **Check variables in Console:**

```javascript
window.ENV.E2EE_ENABLED // should be "true"
```

3. **WebRTC Internals** - Look for:

```
e2ee-enabled: true
mls-protocol: active
encrypted-streams: true
```

### Simulcast Testing

In `chrome://webrtc-internals` look for:

```
outbound-rtp (frameHeight=720, ssrc=428359819)  # high quality
outbound-rtp (frameHeight=720, ssrc=961388367)  # duplicate/backup
inbound-rtp (frameHeight=360, ssrc=144471357)   # adaptive quality
```

## Security Considerations

### Automatic Security Headers

- `X-Frame-Options: DENY` - clickjacking protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Permissions-Policy` - device access restrictions

### WebRTC Exceptions

- WebSocket connections excluded from header processing for compatibility
- CSP disabled to prevent blocking WebRTC functions
- TURN over TLS on ports 443/5349 for corporate firewall bypass

### ICE Servers Priority

1. `turns:turn.cloudflare.com:5349?transport=tcp` (highest priority)
2. `turns:turn.cloudflare.com:443?transport=tcp`
3. `stun:stun.cloudflare.com:3478`

## Common Issues & Gotchas

### Critical Requirements

- **Node.js**: Must use version 20+ (not 18 or lower)
- **Durable Objects**: Use `new_sqlite_classes`, NOT `new_classes` in migrations
- **App Creation**: Create specifically SFU application in Cloudflare Dashboard
- **Correct Paths**: Use `/realtime/sfu/overview` and `/realtime/turn/overview`
- **WebSocket + Security**: CSP can block WebSocket connections
- **Terminal Commands**: Always append `| cat` to commands that may require interaction

### Legacy Calls API Specific Issues

**Authentication Problems:**

- **API Token**: Must have "Calls Write" permissions for SFU app creation
- **Headers**: Use both `X-Auth-Email` and `X-Auth-Key` OR `Authorization: Bearer TOKEN`
- **Account ID**: Must be exact 32-character account identifier

**SFU App Management:**

- **App Environment**: Each app is isolated - Sessions can only access Tracks within same app
- **App Lifecycle**: Apps can be created, retrieved, edited, and deleted via API
- **Naming**: Use descriptive names like "production-realtime-app" for easier management

**TURN Key Management:**

- **Key Purpose**: TURN keys enable NAT traversal when direct P2P connections fail
- **Key Lifecycle**: Keys can be created, listed, edited, and deleted
- **Multiple Keys**: You can have multiple TURN keys per account for different environments

**API Response Structure:**

```json
{
	"success": true,
	"result": {
		"uid": "2a95132c15732412d22c1476fa83f27a", // This is CALLS_APP_ID
		"secret": "66bcf64aa8907b9f9d90ac17746a77ce...", // This is CALLS_APP_SECRET
		"name": "production-realtime-app",
		"created": "2014-01-02T02:20:00Z",
		"modified": "2014-01-02T02:20:00Z"
	}
}
```

**Common API Errors:**

- **10000**: Authentication failed - check API token permissions
- **10001**: Invalid account ID format (must be 32 characters)
- **10002**: App name already exists in account
- **10003**: Rate limiting - too many requests

### Cloudflare Plan Requirements

- **Workers**: Unlimited plan for Durable Objects
- **Calls**: Pay-as-you-go billing
- **Bandwidth**: ~800 GB/month limit for notifications

## Upstream Synchronization

This project is a fork of Cloudflare Orange. To sync with upstream:

```bash
# Fetch latest changes from original repository
git fetch upstream

# View differences with main branch
git log HEAD..upstream/main --oneline

# Merge changes from upstream (carefully!)
git merge upstream/main

# Or create new branch for integration
git checkout -b sync-upstream
git merge upstream/main
```

## AI Assistant Integration

The project includes OpenAI Realtime API integration:

- AI can be invited to conversations
- Uses `thirdparty=true` parameter for external WebRTC server connections
- Requires `OPENAI_MODEL_ENDPOINT` and `OPENAI_API_TOKEN`

## Known Architecture Limitations

- **Always SFU**: Currently uses Cloudflare Calls SFU for all connections (no true P2P for 2 participants)
- **SecurityStatusPanel**: Shows incorrect connection type detection (always reports 'sfu')
- **P2P Fallback**: Described in README but not implemented in current architecture
- **Legacy API**: Uses older Cloudflare Calls API instead of modern RealtimeKit

## Modern Cloudflare RealtimeKit Alternative

For new projects or major refactoring, consider migrating to [Cloudflare RealtimeKit](https://docs.realtime.cloudflare.com/):

### RealtimeKit Advantages

- **Comprehensive SDKs**: Available for Web (JavaScript/React), Mobile (React Native/iOS/Android)
- **UI Kit Components**: Pre-built React, Angular, and Web Components for faster development
- **Better Architecture**: Proper separation between Core SDK and UI components
- **Modern APIs**: Developer-friendly REST APIs for programmatic integration
- **Enhanced Features**: Live video calls, voice calls, interactive live streaming
- **Better Documentation**: Complete guides and API reference

### Migration Considerations

```javascript
// Current implementation (legacy Calls API)
const { partyTracks } = usePeerConnection({ iceServers, ... })

// RealtimeKit approach would be:
// import { RealtimeKit } from '@cloudflare/realtimekit'
// const rtk = new RealtimeKit({ apiKey, ... })
```

### RealtimeKit Core Features

- **Live Video Calls**: WebRTC-based video communication for education, telemedicine, social networks
- **Voice Calls**: High-quality real-time audio for conferences and voice chats
- **Interactive Live Streaming**: Scalable HLS broadcasting for webinars and events
- **Security**: SOC, HIPAA, and GDPR compliant infrastructure
- **REST API**: Simple programmatic integration for meeting creation and management

### Framework Support

- **Web**: JavaScript, React, Angular, HTML/Web Components
- **Mobile**: React Native, iOS (Swift), Android (Kotlin/Java)
- **UI Kit**: Pre-built components for all supported frameworks
