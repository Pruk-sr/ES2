const formatDuration = require('../../../structures/FormatDuration.js');
const { QueueDuration } = require("../../../structures/QueueDuration.js");
const { EmbedBuilder } = require("discord.js");
const ytsr = require("youtube-sr").default;


module.exports = { 
    name: ["nowplaying"],
    description: "Display the song currently playing.",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const realtime = client.config.NP_REALTIME;
        const msg = await interaction.editReply(`กำลังดำเนินการตามคำสั่ง กรุณารอสักครู่คะ...`);
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`❎ ตอนนี้ยังไม่ได้เล่นเพลงอะไรเลยนะ`);
        
        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);
        const TotalDuration = formatDuration(song.length);
        const Part = Math.floor(player.position / song.length * 30);
        const Emoji = player.playing ? "🔴 |" : "⏸ |";
        const embeded = new EmbedBuilder()
        .setAuthor({ name: player.playing ? `กำลังเล่น...` : `หยุดชั่วคราว...`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
        .setDescription(`**[${song.title}](${song.uri})**`)
        .setColor(client.color)
        .addFields({ name: `ช่อง:`, value: `${song.author}`, inline: true })
        .addFields({ name: `เจ้าของคิวนี้:`, value: `${song.requester}`, inline: true })
        .addFields({ name: `🔉 ระดับเสียง:`, value: `${player.volume * 100}%`, inline: true })
        .setTimestamp()
        if (song.thumbnail) {
            const songInfo = await ytsr.searchOne(song.uri);
            const views = songInfo.views;
            const uploadat = songInfo.uploadedAt;
            embeded.setThumbnail(`https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`);
            embeded.addFields({ name: `เพลงในคิว:`, value: `${player.queue.length}`, inline: true })
            embeded.addFields({ name: `ระยะเวลาทั้งหมด:`, value: `${formatDuration(QueueDuration(player))}`, inline: true })
            embeded.addFields({ name: `ลูป:`, value: `${player.loop !== 'none' ? `  |  ${player.loop === "track" ? "เพลง" : "คิว"}` : "ไม่ได้เปิด"}`, inline: true })
            embeded.addFields({ name: `ยอดวิว:`, value: `${views} views`, inline: true })
            embeded.addFields({ name: `อัพโหลด:`, value: `${uploadat}`, inline: true })
            embeded.addFields({ name: `ดาวน์โหลด:`, value: `${player.queue.current.isStream ? "Stream" : `**[y2mate](https://www.y2mate.com/youtube/${song.identifier})**`}`, inline: true })
            embeded.addFields({ name: `🕒 ระยะเวลา: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` })
        } else {
            embeded.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
            embeded.addFields({ name: `เพลงในคิว:`, value: `${player.queue.length}`, inline: true })
            embeded.addFields({ name: `ระยะเวลาทั้งหมด:`, value: `${formatDuration(QueueDuration(player))}`, inline: true })
            embeded.addFields({ name: `🔁 ทำซ้ำ:`, value: `${player.loop !== 'none' ? `  |  Loop: ${player.loop === "track" ? "เพลง" : "คิว"}` : "ไม่ได้เปิด"}`, inline: true })
            embeded.addFields({ name: `ยอดวิว:`, value: `N/A`, inline: true })
            embeded.addFields({ name: `อัพโหลด:`, value: `N/A`, inline: true })
            embeded.addFields({ name: `ดาวน์โหลด:`, value: `N/A`, inline: true })
            embeded.addFields({ name: `🕒 ระยะเวลา: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` })
        }
        const nwp = await msg.edit({ content: " ", embeds: [embeded]});
        if (realtime === 'true') {
        client.interval = setInterval(async () => {
                if (!player.playing) return;
                const song = player.queue.current;
                const CurrentDuration = formatDuration(player.position);
                const TotalDuration = formatDuration(song.length);
                const Part = Math.floor(player.position / song.length * 30);
                const Emoji = player.playing ? "🔴 |" : "⏸ |";
                const embeded = new EmbedBuilder()
                .setAuthor({ name: player.playing ? `กำลังเล่น...` : `หยุดชั่วคราว...`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
                .setDescription(`**[${song.title}](${song.uri})**`)
                .setColor(client.color)
                .addFields({ name: `ช่อง:`, value: `${song.author}`, inline: true })
                .addFields({ name: `เจ้าของคิวนี้:`, value: `${song.requester}`, inline: true })
                .addFields({ name: `🔉 ระดับเสียง:`, value: `${player.volume * 100}%`, inline: true })
                .setTimestamp()
                if (song.thumbnail) {
                    embeded.setThumbnail(`https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`);
                    embeded.addFields({ name: `เพลงในคิว:`, value: `${player.queue.length}`, inline: true })
                    embeded.addFields({ name: `ระยะเวลาทั้งหมด:`, value: `${formatDuration(QueueDuration(player))}`, inline: true })
                    embeded.addFields({ name: `ลูป:`, value: `${player.loop !== 'none' ? `  |  ${player.loop === "track" ? "เพลง" : "คิว"}` : "ไม่ได้เปิด"}`, inline: true })
                    embeded.addFields({ name: `ยอดวิว:`, value: `N/A`, inline: true })
                    embeded.addFields({ name: `อัพโหลด:`, value: `N/A`, inline: true })
                    embeded.addFields({ name: `ดาวน์โหลด:`, value: `${player.queue.current.isStream ? "Stream" : `**[y2mate](https://www.y2mate.com/youtube/${song.identifier})**`}`, inline: true })
                    embeded.addFields({ name: `🕒 ระยะเวลา: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` })
                } else {
                    embeded.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
                    embeded.addFields({ name: `เพลงในคิว:`, value: `${player.queue.length}`, inline: true })
                    embeded.addFields({ name: `ระยะเวลาทั้งหมด:`, value: `${formatDuration(QueueDuration(player))}`, inline: true })
                    embeded.addFields({ name: `🔁 ทำซ้ำ:`, value: `${player.loop !== 'none' ? `  |  ${player.loop === "track" ? "เพลง" : "คิว"}` : "ไม่ได้เปิด"}`, inline: true })
                    embeded.addFields({ name: `ยอดวิว:`, value: `N/A`, inline: true })
                    embeded.addFields({ name: `อัพโหลด:`, value: `N/A`, inline: true })
                    embeded.addFields({ name: `ดาวน์โหลด:`, value: `N/A`, inline: true })
                    embeded.addFields({ name: `🕒 ระยะเวลา: \`[${CurrentDuration} / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` })
                }
                nwp.edit({ content: " ", embeds: [embeded]});
            }, 15000);
                
        } else if (realtime === 'false') {
            if (!player.playing) return;
            if (nwp) nwp.edit({ content: " ", embeds: [embeded] });
        }
    }
 }
