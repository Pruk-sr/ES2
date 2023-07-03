const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player, track, payload) => {
  const guild = await client.guilds.cache.get(player.guildId)

  console.error(payload.error);

  const channel = client.channels.cache.get(player.textChannel);
  if (!channel) return;

  await client.UpdateMusic(player);

  const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`เกิดข้อผิดพลาดขึ้น กำลังดำเนินการเล่นต่ออัตโนมัติ`);

  channel.send({ embeds: [embed] });

  client.logger.error(`Track Error in ${guild.name} / ${player.guildId}. Auto-Leaved!`);
  await player.destroy(guild);
}