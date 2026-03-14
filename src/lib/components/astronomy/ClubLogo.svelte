<script lang="ts">
	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg';
	}

	let { size = 'md' }: Props = $props();

	const dims = { xs: 40, sm: 100, md: 200, lg: 320 };
	let d = $derived(dims[size]);
</script>

<div class="logo" style="width:{d}px; height:{d}px;" role="img" aria-label="UIC Astronomy Club">
	<img src="/club-logo.svg" alt="UIC Astronomy Club" class="w-full h-full" />
</div>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
</style>
