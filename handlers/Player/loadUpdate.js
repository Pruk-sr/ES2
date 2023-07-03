const { Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const formatDuration = require("../../structures/FormatDuration.js");
const { QueueDuration } = require("../../structures/QueueDuration.js");
  
module.exports = async (client) => {
    try {
    client.UpdateQueueMsg = async function (player) {
        let data = await client.db.get(`setup.guild_${player.guildId}`);
        if (data.enable === false) return;

        let channel = await client.channels.cache.get(data.channel);
        if (!channel) return;

        let playMsg = await channel.messages.fetch(data.playmsg, { cache: false, force: true });
        if (!playMsg) return;


        const songStrings = [];
        const queuedSongs = player.queue.map((song, i) => `*${i + 1} • ${song.title} • [${formatDuration(song.length)}]* • ${song.requester}"`);

        await songStrings.push(...queuedSongs);

        const Str = songStrings.slice(0, 10).join('\n');

        const TotalDuration = QueueDuration(player)

        let cSong = player.queue.current;
        let qDuration = `${formatDuration(TotalDuration)}`;

        let embed = new EmbedBuilder()
            .setAuthor({ name: `กำลังเล่น เพลง...`, iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
            .setDescription(`[${cSong.title}](${cSong.uri}) \`[${formatDuration(cSong.duration)}]\` • ${cSong.requester}}`)
            .setColor(client.color)
            .setImage(`${cSong.thumbnail}`)
            .setFooter({ text: `${player.queue.length} • Song's in Queue | Volume • ${player.volume}% | ${qDuration} • Total Duration` })
        
        return await playMsg.edit({ 
            content: `**__คิวทั้งหมด:__**\n${Str == '' ? `เข้าห้องพูดคุยแล้วเพิ่มเพลงโดย ใช้ชื่อหรือลิ้งเพลง ในห้องนี้` : '\n' + Str}`, 
            embeds: [embed], 
            components: [client.enSwitch] 
        }).catch((e) => {});
    };

    /**
     *
     * @param {Player} player
     */
    client.UpdateMusic = async function (player) {
        let data = await client.db.get(`setup.guild_${player.guildId}`);
        if (data.enable === false) return;

        let channel = await client.channels.cache.get(data.channel);
        if (!channel) return;

        let playMsg = await channel.messages.fetch(data.playmsg, { cache: true, force: true });
        if (!playMsg) return;


        const queueMsg = `**__คิวทั้งหมด:__**\nเข้าห้องพูดคุยแล้วเพิ่มเพลงโดย ใช้ชื่อหรือลิ้งเพลง ในห้องนี้`;

        const playEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `ไม่มีเพลง เล่นอยู่ ในปัจจุบัน` })
          .setImage(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpeg?size=300`)
          .setDescription(`>>> [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands) | [Support](https://discord.gg) | [Website](https://google.com)}`)
          .setFooter({ text: `Prefix is: / (SlashCommand)` });

        return await playMsg.edit({ 
            content: `${queueMsg}`, 
            embeds: [playEmbed], 
            components: [client.diSwitch] 
        }).catch((e) => {});
    };
} catch (e) {
    client.logger.error(e);
}
};
