const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["reset"],
    description: "Reset filter",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.reply("กำลังโหลด โปรดรอสักครู่...");

        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`ไม่มีเพลงที่กำลังเล่นอยู่ในกิลด์นี้!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`ฉันไม่ได้อยู่ช่องเสียงเดียวกับคุณ!`);

		const data = {
            op: 'filters',
            guildId: interaction.guild.id,
        }

        await player.send(data);
        await player.setVolume(100);
        
        const resetted = new EmbedBuilder()
            .setDescription(`\`💠\` | *ปิด:* \`ฟิลเตอร์\``)
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: " ", embeds: [resetted] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}