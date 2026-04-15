<script lang="ts">
	import EventDetailPanel from '$lib/components/admin/EventDetailPanel.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.event.title} - Physics Events - UICSpacetime Admin</title>
</svelte:head>

<EventDetailPanel
	event={data.event}
	rsvpList={data.rsvpList}
	stats={data.stats}
	historicalRate={data.historicalRate}
	clubType="physics"
	backHref="/admin/physics/events"
	announcementRecipientCount={data.announcementRecipientCount}
	announcementAlreadySent={data.announcementAlreadySent}
	emailedMembers={data.emailedMembers}
	checkinQuestions={data.checkinQuestions}
	checkinResponses={data.checkinResponses}
/>
