<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Loader2, ArrowLeft, Copy } from 'lucide-svelte/icons';
	import { Button } from '$lib/components/ui/button';
	import { timeAgo, onCopy } from '$lib/utils';
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';

	const { id } = $page.params;

	let loading = $state(true);

	let creation = $state<Creations>();

	const fetchData = async () => {
		if (!id) return;
		try {
			loading = true;
			const res = await fetch(`/api/generations/${id}`, { method: 'GET' });
			const data = await res.json();
			if (!res.ok) throw new Error(data?.message ?? 'Failed to generate');
			creation = data?.data;
		} catch (error: any) {
			toast(error?.message);
		} finally {
			loading = false;
		}
	};

	let copied = $state(false);

	const handleCopy = () => {
		if (!creation?.prompt) return;
		onCopy(creation.prompt);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	};

	fetchData();
</script>

<svelte:head>
	<title>{creation?.prompt} | Luma Mock</title>
</svelte:head>

<div class="py-5">
	<div class="container m-auto">
		<div class="mb-2">
			<Button class="px-0" variant="link" href="/">
				<ArrowLeft class="mr-2 h-4 w-4" />
				返回
			</Button>
		</div>
		{#if loading}
			<div class="flex justify-center p-4">
				<Loader2 class="animate-spin" />
			</div>
		{:else}
			<div class="space-y-4">
				<video
					src={creation?.video?.url}
					class="w-full overflow-hidden rounded-md"
					controls
					autoplay
					loop
				>
					<track kind="captions" src={creation?.video?.url} />
				</video>
				<h2 class="text-2xl">{creation?.prompt}</h2>
				<p>
					<Badge>{timeAgo(creation?.created_at)}</Badge>
				</p>
				<Button class="rounded-[20px]" variant="outline" size="sm" onclick={handleCopy}>
					<Copy class="mr-2 h-4 w-4" />
					{copied ? '已复制' : '复制提示词'}
				</Button>
			</div>
		{/if}
	</div>
</div>
