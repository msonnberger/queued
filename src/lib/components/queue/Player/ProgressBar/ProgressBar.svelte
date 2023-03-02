<script lang="ts">
	export let progress = 0;
</script>

<div class="relative inset-x-0 bottom-full flex flex-auto touch-none items-center gap-6">
	<div class="relative w-full bg-slate-100 dark:bg-slate-700 rounded-full touch-none">
		<div
			class="h-2 rounded-r-md rounded-l-xl bg-slate-900 dark:bg-slate-200 transition-all duration-500 ease-linear"
			style="width: calc({progress}% - 0.25rem);"
		/>
		<div class="absolute top-1/2 -translate-x-1/2 transition-all duration-500 ease-linear" style="left: {progress}%;">
			<div
				class="absolute touch-none h-4 rounded-full w-1 bg-slate-900 dark:bg-slate-200 -translate-x-1/2 -translate-y-1/2"
				style="left: {progress}%;"
			>
				<div
					style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: 0px -1px -1px 0px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;"
				>
					<input tabindex="0" type="range" min="0" max="64" step="1" value="10" />
				</div>
			</div>
		</div>
	</div>
</div>
