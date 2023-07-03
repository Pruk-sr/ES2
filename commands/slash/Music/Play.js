const { convertTime } = require("../../../structures/ConvertTime.js");
const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: ["play"],
    description: "เล่น-หยุดเพลงก็ได้หรือร้องเพลงให้ฟัง",
    category: "Music",
    options: [
        {
            name: "search",
            type: ApplicationCommandOptionType.String,
            description: "คุณสามารถค้นหาเพลงตามชื่อ ID หรือลิงค์",
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction) => {
        try {
            if (interaction.options.getString("search")) {
                await interaction.deferReply({ ephemeral: false });
                const { channel } = interaction.member.voice;
                if (!channel) return interaction.editReply("❓ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าช่องไหน =3=");

                const player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    textId: interaction.channel.id,
                    voiceId: channel.id,
                    volume: 100,
                    deaf: true,
                });


                const string = interaction.options.getString("search");

                const res = await player.search(string, { requester: interaction.user });
                if (!res.tracks.length) return interaction.editReply("❌ เกิดข้อผิดพลาดขณะดำเนินการคำสั่งนี้!");
        
                if (res.type === "PLAYLIST") {
                    for (let track of res.tracks) player.queue.add(track);
        
                    if (!player.playing && !player.paused) player.play();
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`✅ **เพิ่มเพลย์ลิสต์ • [${res.playlistName}](${string})** \`${convertTime(res.tracks[0].length + player.queue.durationLength, true)}\`ประกอบไปด้วยเพลงจำนวน (${res.tracks.length} เพลง) • เรียบร้อยแล้วคะ`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                } else {
                    player.queue.add(res.tracks[0]);
        
                    if (!player.playing && !player.paused) player.play();
        
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`✅ **เพิ่มเพลง • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].length, true)}\` • เรียบร้อยแล้วคะ`)
        
                    return interaction.editReply({ content: " ", embeds: [embed] })
                }
            }
        } catch {
            ///
        }
    }
}