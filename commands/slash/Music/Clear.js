const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["clear"],
    description: "Clear song in queue!",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ อืมม...แต่ว่าเพลงมันยังไม่ได้เริ่มเล่นเลยนะ?`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

        await player.queue.clear();
        const embed = new EmbedBuilder()
            .setDescription("✅ คิวเพลงถูกเคลียเเล้ว")
            .setColor(client.color);
        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}