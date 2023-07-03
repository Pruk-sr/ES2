const { EmbedBuilder, Client, Message } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");
const delay = require("delay");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    try {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.guild || interaction.user.bot) return;
            if (interaction.isButton()) {
                const { customId, member } = interaction;
                let voiceMember = interaction.guild.members.cache.get(member.id);
                let channel = voiceMember.voice.channel;

                let player = await client.manager.players.get(interaction.guild.id);
                if (!player) return;

                const playChannel = client.channels.cache.get(player.textId);
                if (!playChannel) return;

                switch (customId) {
                    case "sprevious":
                        {
                            if (!channel) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (!player || !player.queue.previous) {
                                return interaction.reply(`📼 ยังไม่มีเพลงที่พึ่งเล่นไปเมื่อสักครู่นี้เลยอะ`);
                            } else {
                                await player.queue.unshift(player.queue.previous);
                                await player.skip();

                                const embed = new EmbedBuilder()
                                    .setDescription(`⏮ กลับไปเล่นเพลงที่ผ่านมาแล้ว`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sskip":
                        {
                            if (!channel) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (!player) {
                                return interaction.reply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
                            } else { }
                            if (player.queue.size == 0) {
                                await player.destroy();
                                await client.UpdateMusic(player);

                                const embed = new EmbedBuilder()
                                    .setDescription(`⏭ ข้ามแล้วคะและกำลังจะเริ่มเล่นเพลงใหม่ในคิว`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            } else {
                                await player.skip();

                                const embed = new EmbedBuilder()
                                    .setDescription(`⏭ ข้ามแล้วคะและกำลังจะเริ่มเล่นเพลงใหม่ในคิว`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sstop":
                        {
                            if (!channel) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (!player) {
                                return interaction.reply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
                            } else {
                                await player.destroy();
                                await client.UpdateMusic(player);

                                const embed = new EmbedBuilder()
                                    .setDescription(`✅ หยุดเล่นเพลงและคิวเพลงถูกเคลียเเล้ว`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "spause":
                        {
                            if (!channel) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`);
                            } else if (!player) {
                                return interaction.reply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
                            } else {
                                await player.pause(!player.paused);
                                const uni = player.paused ? `⏸ หยุดเล่นเพลงชั่วคราวแล้วคะ` : `▶️ กำลังเล่นเพลงต่อจากจุดเดิมแล้วคะ`;

                                const embed = new EmbedBuilder()
                                    .setDescription(uni)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sloop":
                        {
                            if (!player) {
                                collector.stop();
                            }
                            const loop_mode = {
                                none: "none",
                                track: "track",
                                queue: "queue"
                            }

                            if (player.loop === "queue") {
                                await player.setLoop(loop_mode.none)

                                const unloopall = new EmbedBuilder()
                                    .setDescription(`🔁 **ยกเลิก**ทำซ้ำคิวปัจจุบัน`)
                                    .setColor(client.color);
                                return await interaction.reply({ content: ' ', embeds: [unloopall] });
                            } else if (player.loop === "none") {
                                await player.setLoop(loop_mode.queue)
                                const loopall = new EmbedBuilder()
                                    .setDescription(`🔁 ทำซ้ำคิวปัจจุบัน`)
                                    .setColor(client.color);
                                return await interaction.reply({ content: ' ', embeds: [loopall] });
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
    /**
     * @param {Client} client
     * @param {Message} message
     */

    client.on("messageCreate", async (message) => {
        try {
        if (!message.guild || !message.guild.available) return;
        let database = await client.db.get(`setup.guild_${message.guild.id}`)
        let player = client.manager.players.get(message.guild.id)

        if (!database) await client.db.set(`setup.guild_${message.guild.id}`, {
            enable: false,
            channel: "",
            playmsg: "",
            voice: "",
            category: ""
        })

        database = await client.db.get(`setup.guild_${message.guild.id}`)

        if (!database.enable) return;

        let channel = await message.guild.channels.cache.get(database.channel);
        if (!channel) return;

        if (database.channel != message.channel.id) return;

        if (message.author.id === client.user.id) {
            await delay(3000);
            message.delete()
        }

        if (message.author.bot) return;

        const song = message.cleanContent;
        await message.delete();
        if (!song) return

        let voiceChannel = await message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ`).then((msg) => {
            setTimeout(() => {
                msg.delete()
            }, 4000);
        });

        let msg = await message.channel.messages.fetch(database.playmsg)

        if (!player) player = await client.manager.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            deaf: true,
        });

        const result = await player.search(song, { requester: message.author });
        const tracks = result.tracks;

        if (!result.tracks.length) return msg.edit({
            content: `**__คิวทั้งหมด:__**\n${Str == '' ? `เข้าห้องพูดคุยแล้วเพิ่มเพลงโดย ใช้ชื่อหรือลิ้งเพลง ในห้องนี้` : '\n' + Str}`,
        });
        if (result.type === 'PLAYLIST') for (let track of tracks) player.queue.add(track)
        else if (player.playing && result.type === 'SEARCH') player.queue.add(tracks[0])
        else if (player.playing && result.type !== 'SEARCH') for (let track of tracks) player.queue.add(track)
        else player.play(tracks[0]);

        if (result.type === 'PLAYLIST') {
            const embed = new EmbedBuilder()
                .setDescription(`✅ **เพิ่มเพลย์ลิสต์ • [${result.tracks[0].title}](${result.tracks[0].uri}) ${convertTime(result.tracks[0].length + player.queue.durationLength, true)} (ประกอบไปด้วยเพลงจำนวน ${result.tracks.length} เพลง) • ${result.tracks[0].requester} • เรียบร้อยแล้วคะ`)
                .setColor(client.color)
            msg.reply({ content: " ", embeds: [embed] });
        } else if (result.type === 'TRACK') {
            const embed = new EmbedBuilder()
                .setDescription(`✅ **เพิ่มเพลง • [${result.tracks[0].title}](${result.tracks[0].uri})** ${convertTime(result.tracks[0].length, true)} • ${result.tracks[0].requester} • เรียบร้อยแล้วคะ`)
                .setColor(client.color)
            msg.reply({ content: " ", embeds: [embed] });
        } else if (result.type === 'SEARCH') {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`✅ **เพิ่มเพลง • [${result.tracks[0].title}](${result.tracks[0].uri})** ${convertTime(result.tracks[0].length, true)} • ${result.tracks[0].requester} • เรียบร้อยแล้วคะ`)
            msg.reply({ content: " ", embeds: [embed] });
        }
        
        await client.UpdateQueueMsg(player);
    } catch (e) {
        client.logger.error(e);
    }
});  
};
