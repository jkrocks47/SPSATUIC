export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatShortDate(date: string | Date): { month: string; day: string } {
	const d = typeof date === 'string' ? new Date(date) : date;
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
	const d = typeof date === 'string' ? new Date(date) : date;
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
