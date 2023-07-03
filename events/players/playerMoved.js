const { EmbedBuilder } = require("discord.js")

module.exports = async (client, player) => {
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;
    const channel = client.channels.cache.get(player.textId);
    if (channel.newChannelId === channel.oldChannelId) return;
    if (channel.newChannelId === null || !channel.newChannelId) {
        if (!playerr) return;
        player.destroy();
        if (channel) return await channel.send({ embeds: [EmbedBuilder().setDescription(`มีใครบางคนตัดการเชื่อมต่อฉันจาก <#${channel.oldChannelId}> คะ`).setColor(client.color)] }).then((a) => setTimeout(async () => await a.delete().catch(() => { }), 12000)).catch(() => { });
    } else {
        if (!player) return;
        player.setVoiceChannel(channel.newChannelId);
        if (channel) await channel.send({ embeds: [EmbedBuilder().setDescription(`ยืนยันสำเร็จย้ายช่องเสียงของผู้เล่นไปที่ <#${dispatcher.voiceId}>.`).setColor(client.color)] }).then((a) => setTimeout(async () => await a.delete().catch(() => { }), 12000)).catch(() => { });
        if (player.paused) player.pause(false);
    }
};
