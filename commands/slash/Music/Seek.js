const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../../structures/FormatDuration.js')

module.exports = { 
    name: ["seek"],
    description: "เปลี่ยนระยะเวลาของเพลงที่กำลังเล่นอยู่",
    category: "Music",
    options: [
        {
            name: "time",
            description: "เวลาเป็นวินาทีที่คุณต้องการเปลี่ยนช่วง. ตัวอย่าง: 0:10 or 120:10",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const value = interaction.options.getInteger("time");
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ยังไม่ได้เล่นเพลงอะไรเลยนะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')
        const Duration = formatDuration(player.position);
        if (!value) return await interaction.reply(`❓ ต้องการเปลี่ยนเวลาของเพลงที่เล่นอยู่เป็นเวลากี่วินาทีดีคะ? ตอนนี้เล่นอยู่วินาทีที่ ${Duration}`);
		if(value * 1000 >= player.queue.current.length || value < 0) return interaction.editReply(`❎ เวลาของเพลงนี้อยู่ที่ ${Duration} เกินกว่านี้ก็ไม่มีอะไรอะ`);
        
		await player.seek(value * 1000);
        const embed = new EmbedBuilder()
            .setDescription(`⏮ ข้ามไปที่: ${Duration}`)
            .setColor(client.color);

        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}