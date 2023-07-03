const { EmbedBuilder, Client } = require("discord.js");

 module.exports = async (client, player) => {
	const guild = await client.guilds.cache.get(player.guildId)
	client.logger.info(`Player Destroy in @ ${guild.name} / ${player.guildId}`);

	const channel = client.channels.cache.get(player.textId);
	client.sent_queue.set(player.guildId, false)
	let data = await client.db.get(`autoreconnect.guild_${player.guildId}`)

	if (!channel) return;

	if (player.state == 5 && data) {
		await client.manager.createPlayer({
			guildId: data.guild,
			voiceId: data.voice,
			textId: data.text,
			deaf: true,
		});
	}

	await client.UpdateMusic(player);
}