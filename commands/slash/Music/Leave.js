const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["leave"],
    description: "Disconnect the bot from your voice channel",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const player = client.manager.players.get(interaction.guild.id);
        const meChannel = interaction.guild.members.me.voice.channel;
        const { channel } = interaction.member.voice;

		if (!player) return interaction.editReply(`ไม่มีเพลงที่กำลังเล่นอยู่ในกิลด์นี้!`);

        if (!player.queue.current || !player.queue.current.requester || interaction.user.id !== player.queue.current.requester.id) {
        return await interaction.editReply('🚫 คุณยังไม่สามารถใช้งานคำสั่งนี้ได้ในขณะนี้ เนื่องจากมีสมาชิกอื่นกำลังเล่นเพลงอยู่คะ');
         }

        if (!meChannel) return await interaction.editReply("❎ ตอนนี้ฉันยังไม่ได้อยู่ในช่องไหนเลย...");

        await player.destroy();
        
        const embed = new EmbedBuilder()
            .setDescription(`◀️ ฉันออกมาจากช่อง\`${channel.name}\` แล้วคะ`)
            .setColor(client.color);
        return interaction.editReply({ embeds: [embed] })
    }
}
