const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../../structures/ConvertTime.js");
// Main code
module.exports = {
    name: ["mp3"],
    description: "เล่นเพลงก็ได้หรือร้องเพลงให้ฟัง โดยใช้ไฟล์ Mp3",
    categories: "Music",
    options: [
        {
            name: "file",
            description: "ไฟล์ที่ต้องการ",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        let player = client.manager.players.get(interaction.guild.id)

        const file = await interaction.options.getAttachment("file")
        const msg = await interaction.editReply(`🔍 **กำลังค้นหา...** ${file.name}`);
        const { channel } = interaction.member.voice;
        if (!channel) return msg.edit("❓ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าช่องไหน =3=");

        if (file.contentType !== "audio/mpeg" && file.contentType !== "audio/ogg") return msg.edit("โปรดใช้ไฟล์เพลงที่ถูกต้องเพื่อใช้คุณสมบัตินี้ โปรดทราบว่าฉันรองรับเฉพาะนามสกุล mp3/ogg เท่านั้นนะคะ")
        if (!file.contentType) msg.edit("คำเตือน: ระบบตรวจไม่พบประเภทไฟล์ของคุณ ระบบอาจไม่สามารถเล่นเพลงได้ ฉันขอแนะนำให้คุณเลือกประเภทไฟล์ที่มีนามสกุล .mp3 คะ")

        if (!player) player = await client.manager.createPlayer({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id,
            textId: interaction.channel.id,
            deaf: true,
        });

        const result = await player.search(file.attachment, { requester: interaction.user });
        const tracks = result.tracks;

        if (!result.tracks.length) return msg.edit({ content: `❌ เกิดข้อผิดพลาดขณะดำเนินการคำสั่งนี้!` });
        if (result.type === 'PLAYLIST') for (let track of tracks) player.queue.add(track)
        else if (player.playing && result.type === 'SEARCH') player.queue.add(tracks[0])
        else if (player.playing && result.type !== 'SEARCH') for (let track of tracks) player.queue.add(track)
        else player.play(tracks[0]);

        if (result.type === 'PLAYLIST') {
            const embed = new EmbedBuilder()
                .setDescription(`✅ **เพิ่มเพลย์ลิสต์ • [${file.name}](${file.attachment})** ${convertTime(tracks[0].length, true)} ประกอบไปด้วยเพลงจำนวน (${tracks.length} เพลง) • เรียบร้อยแล้วคะ\n\n **Note**: ระบบที่เกี่ยวกับเพลงทั้งหมดจะมีการขึ้น Unknown เป็นบางคำสั่งนะคะ`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
            if (!player.playing) player.play();
        } else if (result.type === 'TRACK') {
            const embed = new EmbedBuilder()
                .setDescription(`✅ **เพิ่มเพลง • [${file.name}](${file.attachment})** ${convertTime(tracks[0].length, true)} • เรียบร้อยแล้วคะ \n\n **Note**: ระบบที่เกี่ยวกับเพลงทั้งหมดจะมีการขึ้น Unknown เป็นบางคำสั่งนะคะ`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
            if (!player.playing) player.play();
        } else if (result.type === 'SEARCH') {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`✅ **เพิ่มเพลง • [${file.name}](${file.attachment})** ${convertTime(tracks[0].length, true)} • เรียบร้อยแล้วคะ\n\n **Note**: ระบบที่เกี่ยวกับเพลงทั้งหมดจะมีการขึ้น Unknown เป็นบางคำสั่งนะคะ`)
            msg.edit({ content: " ", embeds: [embed] });
            if (!player.playing) player.play();
        }
        else {
            msg.edit(`❌ เกิดข้อผิดพลาดขณะดำเนินการคำสั่งนี้!`);
            player.destroy();
        }
    }
};