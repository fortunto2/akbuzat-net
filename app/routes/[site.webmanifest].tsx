import { json } from 'react-router'

export const loader = async () => {
	return json({
		name: 'Akbuzat.net',
		short_name: 'Akbuzat.net',
		description: 'Modern video calling and collaboration platform',
		icons: [
			{
				src: '/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any maskable',
			},
			{
				src: '/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any maskable',
			},
		],
		theme_color: '#ffffff',
		background_color: '#ffffff',
		display: 'standalone',
		orientation: 'portrait-primary',
		// iOS specific settings
		start_url: '/',
		scope: '/',
		// Ensure proper HTTPS context
		prefer_related_applications: false,
		// Categories for app stores
		categories: ['communication', 'productivity', 'business'],
		// Language
		lang: 'en',
		// Display override for better PWA support
		display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
	})
}
