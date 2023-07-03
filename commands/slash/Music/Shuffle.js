const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["shuffle"],
    description: "สับเปลี่ยนในคิว",
    category: "Music",
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ยังไม่ได้เล่นเพลงอะไรเลยนะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

		await player.queue.shuffle();

        const embed = new EmbedBuilder()
            .setDescription(`🔀 เริ่มสับเปลี่ยนคิวแล้ว...`)
            .setColor(client.color);
        
        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}