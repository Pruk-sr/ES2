const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["pause"],
    description: "หยุดเล่นเพลงในคิวชั่วคราว",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')
        
        await player.pause(player.playing);
        if (player.paused) return await interaction.editReply(`📼 ตอนนี้ฉันก็หยุดอยู่นะ วันนี้ดูแปลกๆ แฮ่ะ..`);

        const embed = new EmbedBuilder()
            .setDescription(`⏸ หยุดเล่นเพลงชั่วคราวแล้วคะ`)
            .setColor(client.color);

        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}