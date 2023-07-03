const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
module.exports = {
    name: ["247"],
    description: "24/7 in voice channel",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`กำลังโหลด โปรดรอสักครู่...`);

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`❎ อืมม...แต่ว่าเพลงมันยังไม่ได้เริ่มเล่นเลยนะ?`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);

        let data = await client.db.get(`autoreconnect.guild_${interaction.guild.id}`)

        if (data) {
            await client.db.delete(`autoreconnect.guild_${interaction.guild.id}`)
            const on = new EmbedBuilder()
                .setDescription(`🌙 ปิดการใช้งาน โหมด 24/7 `)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [on] });

        } else if (!data) {
            await client.db.set(`autoreconnect.guild_${interaction.guild.id}`, {
                guild: player.guildId,
                text: player.textId,
                voice: player.voiceId
            })
            
            const on = new EmbedBuilder()
                .setDescription(`🌕 เปิดการใช้งาน โหมด 24/7`)
                .setColor(client.color);
            return msg.edit({ content: " ", embeds: [on] });
        }
    }
}