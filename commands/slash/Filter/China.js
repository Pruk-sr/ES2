const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "china"],
    description: "Turning on china filter",
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
                speed: 0.75, 
                pitch: 1.25, 
                rate: 1.25 
            }
        }

        await player.send(data);

        const embed = new EmbedBuilder()
            .setDescription("`💠` | *เปิดฟิลเตอร์:* `China`")
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: " ", embeds: [embed] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}