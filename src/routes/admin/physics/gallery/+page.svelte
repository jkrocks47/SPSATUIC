<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Physics Gallery - UICSpacetime Admin</title>
</svelte:head>

<div class="gallery-page">
	<h1 class="page-title">Physics Gallery</h1>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-message">
			{form.action === 'delete' ? 'Image deleted successfully.' : 'Image uploaded successfully.'}
		</div>
	{/if}

	<div class="upload-card">
		<h2>Upload Image</h2>
		<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance>
			<div class="upload-grid">
				<div class="form-group">
					<label for="image">Image *</label>
					<input type="file" id="image" name="image" accept="image/*" required />
				</div>
				<div class="form-group">
					<label for="caption">Caption</label>
					<input type="text" id="caption" name="caption" />
				</div>
				<div class="form-group">
					<label for="photographer">Photographer</label>
					<input type="text" id="photographer" name="photographer" />
				</div>
			</div>
			<button type="submit" class="submit-btn">Upload</button>
		</form>
	</div>

	<div class="image-grid">
		{#if data.images.length === 0}
			<p class="empty-state">No images yet. Upload your first image above.</p>
		{:else}
			{#each data.images as image}
				<div class="image-card">
					<div class="image-wrapper">
						<img src={image.thumbnailUrl || image.url} alt={image.caption || 'Gallery image'} loading="lazy" />
					</div>
					<div class="image-info">
						{#if image.caption}
							<p class="image-caption">{image.caption}</p>
						{/if}
						{#if image.photographer}
							<p class="image-photographer">by {image.photographer}</p>
						{/if}
						<p class="image-date">
							{image.uploadDate ? new Date(image.uploadDate).toLocaleDateString() : ''}
						</p>
						<form method="POST" action="?/delete" use:enhance class="delete-form">
							<input type="hidden" name="id" value={image.id} />
							<button type="submit" class="delete-btn" onclick={(e) => {
								if (!confirm('Delete this image?')) e.preventDefault();
							}}>Delete</button>
						</form>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.gallery-page {
		max-width: 960px;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #191923;
		margin-bottom: 1.5rem;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #16a34a;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.upload-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.upload-card h2 {
		font-size: 1.1rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 1rem;
	}

	.upload-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.3rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.5rem 0.65rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #374151;
	}

	.form-group input:focus {
		outline: none;
		border-color: #0e79b2;
		box-shadow: 0 0 0 3px rgba(14, 121, 178, 0.1);
	}

	.submit-btn {
		padding: 0.5rem 1.25rem;
		background: #0e79b2;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.825rem;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:hover {
		background: #0b6290;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		color: #9ca3af;
		font-size: 0.9rem;
		padding: 2rem;
	}

	.image-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.image-wrapper {
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: #f3f4f6;
	}

	.image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-info {
		padding: 0.75rem;
	}

	.image-caption {
		font-size: 0.85rem;
		font-weight: 500;
		color: #374151;
	}

	.image-photographer {
		font-size: 0.75rem;
		color: #9ca3af;
		margin-top: 0.15rem;
	}

	.image-date {
		font-size: 0.7rem;
		color: #d1d5db;
		margin-top: 0.25rem;
	}

	.delete-form {
		margin-top: 0.5rem;
	}

	.delete-btn {
		background: none;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.7rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.delete-btn:hover {
		background: #fef2f2;
	}
</style>
