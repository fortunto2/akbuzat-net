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
	// Content Security Policy - critical for XSS protection
	csp: [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://browser-intake-datadoghq.eu",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data: blob: https:",
		"media-src 'self' blob:",
		"connect-src 'self' wss: https:",
		"worker-src 'self' blob:",
		"frame-ancestors 'none'",
		"form-action 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		"upgrade-insecure-requests"
	].join('; '),
	
	// Referrer Policy - prevents leaking sensitive data in referrer
	referrerPolicy: 'strict-origin-when-cross-origin',
	
	// X-Frame-Options - prevents clickjacking attacks
	xFrameOptions: 'DENY',
	
	// X-Content-Type-Options - prevents MIME type sniffing
	xContentTypeOptions: 'nosniff',
	
	// Permissions Policy - restricts access to device features
	permissionsPolicy: [
		'camera=(self)',
		'microphone=(self)',
		'geolocation=()',
		'payment=()',
		'usb=()',
		'magnetometer=()',
		'gyroscope=()',
		'accelerometer=()'
	].join(', '),
	
	// Cross-Origin Resource Policy - controls cross-origin access
	crossOriginResourcePolicy: 'same-origin'
};

/**
 * Generate a random nonce for CSP
 */
export function generateNonce(): string {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array));
}

/**
 * Add security headers to a Response
 */
export function addSecurityHeaders(
	response: Response, 
	config: SecurityHeadersConfig = DEFAULT_SECURITY_CONFIG,
	nonce?: string
): Response {
	const newResponse = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: new Headers(response.headers)
	});

	if (config.csp) {
		let csp = config.csp;
		// Add nonce to script-src if provided
		if (nonce) {
			csp = csp.replace(
				/script-src 'self' 'unsafe-inline' 'unsafe-eval'/,
				`script-src 'self' 'nonce-${nonce}'`
			);
		}
		newResponse.headers.set('Content-Security-Policy', csp);
	}
	
	// Remove temporary nonce header
	newResponse.headers.delete('X-CSP-Nonce');
	
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
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://browser-intake-datadoghq.eu",
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
