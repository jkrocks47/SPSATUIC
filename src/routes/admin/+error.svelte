<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-page">
	<h1>{$page.status}</h1>
	<p>{$page.error?.message || 'Something went wrong.'}</p>
	<a href="/admin">Back to Admin</a>
</div>

<style>
	.error-page {
		max-width: 480px;
		margin: 4rem auto;
		text-align: center;
	}

	h1 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 3rem;
		font-weight: 700;
		color: #191923;
	}

	p {
		font-size: 1rem;
		color: #6b7280;
		margin: 0.75rem 0 1.5rem;
	}

	a {
		display: inline-block;
		padding: 0.5rem 1.25rem;
		background: #4f46e5;
		color: #fff;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
	}

	a:hover {
		background: #4338ca;
	}
</style>
