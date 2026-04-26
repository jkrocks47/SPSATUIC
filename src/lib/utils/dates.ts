export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
	return d.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatShortDate(date: string | Date): { month: string; day: string } {
	const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
	return {
		month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
		day: d.getDate().toString().padStart(2, '0')
	};
}

export function getCalendarDays(year: number, month: number): (number | null)[] {
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const days: (number | null)[] = [];

	for (let i = 0; i < firstDay; i++) days.push(null);
	for (let i = 1; i <= daysInMonth; i++) days.push(i);
	while (days.length < 42) days.push(null);

	return days;
}

export function isToday(date: string | Date): boolean {
	const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
	const today = new Date();
	return (
		d.getDate() === today.getDate() &&
		d.getMonth() === today.getMonth() &&
		d.getFullYear() === today.getFullYear()
	);
}

export function isPastEvent(date: string | Date): boolean {
	const eventDate = typeof date === 'string' ? new Date(date + 'T23:59:59') : date;
	return eventDate < new Date();
}

// Parses a free-text time string ("7:00 PM", "19:00", "7pm") into {hours, minutes}
// in 24-hour form. Returns null if the string can't be parsed.
function parseEventTime(time: string): { hours: number; minutes: number } | null {
	const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
	if (!match) return null;
	let hours = parseInt(match[1], 10);
	const minutes = match[2] ? parseInt(match[2], 10) : 0;
	const meridiem = match[3]?.toLowerCase();
	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
	if (meridiem === 'pm' && hours < 12) hours += 12;
	else if (meridiem === 'am' && hours === 12) hours = 0;
	return { hours, minutes };
}

// Returns true when the event's start moment has passed. If no time is given,
// the event is considered started at midnight on its date.
export function hasEventStarted(date: string | Date, time?: string | null): boolean {
	const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
	let startIso = `${dateStr}T00:00:00`;
	if (time) {
		const parsed = parseEventTime(time);
		if (parsed) {
			startIso = `${dateStr}T${String(parsed.hours).padStart(2, '0')}:${String(parsed.minutes).padStart(2, '0')}:00`;
		}
	}
	return new Date(startIso) <= new Date();
}
