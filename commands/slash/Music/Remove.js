const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");

module.exports = { 
    name: ["remove"],
    description: "ลบเพลงออกจากคิว",
    category: "Music",
    options: [
        {
            name: "position",
            description: "หมายเลขของเพลงที่ต้องการจะลบ",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
        }
    ],
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ยังไม่ได้เล่นเพลงอะไรเลยนะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

        const tracks = interaction.options.getInteger("position");
        if (tracks == 0) return interaction.editReply(`🚫 ไม่สามารถลบเพลงที่กำลังเล่นอยู่ได้คะ.`);
        if (tracks > player.queue.size) return interaction.editReply(`❎ ไม่มีคิวดังกล่าวคะ ลองตรวจสอบใหม่ดูอีกครั้งนะคะ`);

        const song = player.queue[tracks - 1];
        await player.queue.splice(tracks - 1, 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`❌ ลบ ** [${song.title}](${song.uri})** \`${convertTime(song.length, true)}\` • ${song.requester} ** ออกจากคิวแล้วคะ.`)

        return interaction.editReply({ content: " ", embeds: [embed] });
    }
}