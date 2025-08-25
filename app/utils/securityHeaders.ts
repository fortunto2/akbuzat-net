/**
 * Security headers utility for Cloudflare Workers
 * Implements security headers to fix akbuzat.net security issues
 */

export interface SecurityHeadersConfig {
	csp?: string;
	referrerPolicy?: string;
	xFrameOptions?: string;
	xContentTypeOptions?: string;
	permissionsPolicy?: string;
	crossOriginResourcePolicy?: string;
}

/**
 * Default security headers configuration
 * Based on security audit recommendations for akbuzat.net
 */
export const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
	// CSP temporarily disabled - was causing WebSocket connection issues
	// Will re-enable with relaxed policy once WebSocket issues are resolved
	// csp: "...",
	
	// Referrer Policy - safe header, prevents leaking sensitive URLs
	referrerPolicy: 'strict-origin-when-cross-origin',
	
	// X-Frame-Options - prevents clickjacking, very safe
	xFrameOptions: 'DENY',
	
	// X-Content-Type-Options - prevents MIME sniffing (Cloudflare already sets this)
	// xContentTypeOptions: 'nosniff',
	
	// Permissions Policy - restricts device features, safe for video conferencing
	permissionsPolicy: [
		'camera=(self)',      // Allow camera for video calls
		'microphone=(self)',  // Allow microphone for audio
		'geolocation=()',     // Disable geolocation
		'payment=()',         // Disable payment APIs
		'usb=()',            // Disable USB access
		'magnetometer=()',   // Disable sensors
		'gyroscope=()',
		'accelerometer=()'
	].join(', '),
	
	// Cross-Origin Resource Policy - safe, prevents unwanted cross-origin access
	crossOriginResourcePolicy: 'same-origin'
};

/**
 * Add security headers to a Response
 */
export function addSecurityHeaders(
	response: Response, 
	config: SecurityHeadersConfig = DEFAULT_SECURITY_CONFIG
): Response {
	const newResponse = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: new Headers(response.headers)
	});

	if (config.csp) {
		newResponse.headers.set('Content-Security-Policy', config.csp);
	}
	
	if (config.referrerPolicy) {
		newResponse.headers.set('Referrer-Policy', config.referrerPolicy);
	}
	
	if (config.xFrameOptions) {
		newResponse.headers.set('X-Frame-Options', config.xFrameOptions);
	}
	
	if (config.xContentTypeOptions) {
		newResponse.headers.set('X-Content-Type-Options', config.xContentTypeOptions);
	}
	
	if (config.permissionsPolicy) {
		newResponse.headers.set('Permissions-Policy', config.permissionsPolicy);
	}
	
	if (config.crossOriginResourcePolicy) {
		newResponse.headers.set('Cross-Origin-Resource-Policy', config.crossOriginResourcePolicy);
	}

	return newResponse;
}

/**
 * Security middleware for development with relaxed CSP
 */
export const DEVELOPMENT_SECURITY_CONFIG: SecurityHeadersConfig = {
	...DEFAULT_SECURITY_CONFIG,
	csp: [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://browser-intake-datadoghq.eu https://static.cloudflareinsights.com",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data: blob: https:",
		"media-src 'self' blob:",
		"connect-src 'self' wss: ws: https: http:",
		"worker-src 'self' blob:",
		"frame-ancestors 'none'",
		"form-action 'self'",
		"base-uri 'self'",
		"object-src 'none'"
		// Note: removed upgrade-insecure-requests for development
	].join('; ')
};
