const { EmbedBuilder } = require('discord.js');
const { KazagumoTrack } = require('kazagumo');

module.exports = { 
    name: ["previous"],
    description: "กลับไปยังเพลงก่อนหน้านี้",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return interaction.editReply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')
        
        if (!player.queue.previous) return interaction.editReply(`📼 ยังไม่มีเพลงที่พึ่งเล่นไปเมื่อสักครู่นี้เลยอะ`);

        await player.play(new KazagumoTrack(player.queue.previous.getRaw(), interaction.user));

        const embed = new EmbedBuilder()
            .setDescription("⏮ กลับไปเล่นเพลงที่ผ่านมาแล้ว")
            .setColor(client.color);

        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}