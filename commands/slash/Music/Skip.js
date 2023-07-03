const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["skip"],
    description: "ข้ามเพลงที่กำลังเล่นอยู่",
    category: "Music",
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ ข้ามไม่ได้อ่ะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

        if (player.queue.size == 0) {
            await player.destroy();
            const skipped = new EmbedBuilder()
                .setDescription(`❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ ข้ามไม่ได้อ่ะ`)
                .setColor(client.color);
                return interaction.editReply({ content: " ", embeds: [skipped] });
        } else {
        await player.skip();
        const skipped = new EmbedBuilder()
            .setDescription(`⏭ ข้ามแล้วคะและกำลังจะเริ่มเล่นเพลงใหม่ในคิว`)
            .setColor(client.color);

            return interaction.editReply({ content: " ", embeds: [skipped] });
    }
  }
};