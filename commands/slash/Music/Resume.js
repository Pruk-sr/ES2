const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["resume"],
    description: "เล่นต่อ",
    category: "Music",
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ยังไม่ได้เล่นเพลงอะไรเลยนะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')
        
        await player.pause(player.playing);
        if (!player.paused) return await interaction.editReply("📼 เห..ตอนนี้ฉันก็กำลังเล่นอยู่นะ");

        const embed = new EmbedBuilder()
            .setDescription(`▶️ กำลังเล่นเพลงต่อจากจุดเดิมแล้วคะ`)
            .setColor(client.color);

        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}