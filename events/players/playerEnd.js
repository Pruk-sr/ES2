const { EmbedBuilder, Client } = require("discord.js");

 module.exports = async (client, player) => {
	const guild = await client.guilds.cache.get(player.guildId)
	client.logger.info(`Player End in @ ${guild.name} / ${player.guildId}`);

	let data = await client.db.get(`autoreconnect.guild_${player.guildId}`)
	const channel = client.channels.cache.get(player.textChannel);
	if (!channel) return;

	if (data) return;

	if (player.queue.length) return


    await client.UpdateMusic(player);
    
    const embed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`🍃 ตอนนี้ฉันคิวว่างแล้ว พร้อมที่จะเล่นเพลงต่อไปแล้วคะ`);

    if(channel) channel.send({ embeds: [embed] });
    player.destroy();
}