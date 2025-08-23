import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js')
			.then((registration) => {
				console.log('SW registered: ', registration)
			})
			.catch((registrationError) => {
				console.log('SW registration failed: ', registrationError)
			})
	})
}

startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
