import { createBackup } from "@nora-soderlund/cloudflare-d1-backups";

export default {
	async scheduled(event, env, ctx) {
		await createBackup(env.BTD6_INDEX_DB, env.BTD6_INDEX_BACKUP, {
			fileName: `backups/${new Date().toISOString()}`
		});
		const files = await env.BTD6_INDEX_BACKUP.list({prefix: 'backups'});
		if (files.objects.length > 800) {
			await env.BTD6_INDEX_BACKUP.delete(
				files.objects.slice(0, files.objects.length - 800).map(obj => obj.key)
			);
		}
	},
};
