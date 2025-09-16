import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    let refreshed = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshed) return
        refreshed = true
        window.location.reload()
    })

    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            console.log('SW registered: ', registration)

            // Force update check
            await registration.update()

            // If there's a waiting worker, tell it to take control immediately
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' })
            }

            // Also handle future updates becoming waiting
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing
                if (!newWorker) return
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
                    }
                })
            })
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError)
        }
    })
}

startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
