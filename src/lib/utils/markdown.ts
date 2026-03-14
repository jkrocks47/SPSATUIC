import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * Render a markdown string to sanitized HTML.
 * Used for body text content that supports markdown formatting.
 */
export function renderMarkdown(md: string): string {
	const raw = marked.parse(md);
	if (typeof raw !== 'string') return '';
	return sanitizeHtml(raw, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			img: ['src', 'alt', 'title']
		}
	});
}
