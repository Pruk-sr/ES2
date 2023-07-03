const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const delay = require("delay");


module.exports = async (client, oldState, newState) => {
	try {
    let data = await client.db.get(`autoreconnect.guild_${newState.guild.id}`)


    const player = client.manager.players.get(newState.guild.id);
    if (!player) return;
	if (!newState.guild.members.cache.get(client.user.id).voice.channelId) player.destroy();

	if (newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.members.me.voice.suppress) {
		if (newState.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect) || (newState.channel && newState.channel.permissionsFor(nS.guild.members.me).has(PermissionsBitField.Flags.Speak))) {
			newState.guild.members.me.voice.setSuppressed(false);
		}
	}

	if (oldState.id === client.user.id) return;
	if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

	if (data) return;

	const vcRoom = oldState.guild.members.me.voice.channel.id;

	const leaveEmbed = client.channels.cache.get(player.textId);

	if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
		if (oldState.guild.members.me.voice?.channel && oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0) {

				await delay('30000');

				const vcMembers = oldState.guild.members.me.voice.channel?.members.size;
				if (!vcMembers || vcMembers === 1) {
				const newPlayer = client.manager?.players.get(newState.guild.id)
				newPlayer ? player.destroy() : oldState.guild.members.me.voice.channel.leave();
                const TimeoutEmbed = new EmbedBuilder()
                .setDescription(`💨 อ้าว..หายไปไหนกันหมดอะ? งั้นน..ชิ่งงงก่อนละ~`)
                .setColor(client.color);
				try {
		      if (leaveEmbed) leaveEmbed.send({ embeds: [TimeoutEmbed] });
		    } catch (error) {
		      console.log(error);
		    }
			}
		}
	}
} catch (e) {
    client.logger.error(e);
}
};