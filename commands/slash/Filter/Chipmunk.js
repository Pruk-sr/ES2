const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "chipmunk"],
    description: "Turning on chipmunk filter",
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
            timescale: {
                speed: 1.05,
                pitch: 1.35,
                rate: 1.25
            },
        }

        await player.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`\`💠\` | *เปิดฟิลเตอร์:* \`Chipmunk\``)
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: " ", embeds: [embed] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}