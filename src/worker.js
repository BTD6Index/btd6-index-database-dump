import { createBackup } from "@nora-soderlund/cloudflare-d1-backups";

const MAX_FILES = 150;

export default {
	async scheduled(event, env, ctx) {
		await createBackup(env.BTD6_INDEX_DB, env.BTD6_INDEX_BACKUP, {
			fileName: `backups/${new Date().toISOString()}.sql`
		});
		const files = await env.BTD6_INDEX_BACKUP.list({prefix: 'backups'});
		if (files.objects.length > MAX_FILES) {
			await env.BTD6_INDEX_BACKUP.delete(
				files.objects.slice(0, files.objects.length - MAX_FILES).map(obj => obj.key)
			);
		}
	},
};
