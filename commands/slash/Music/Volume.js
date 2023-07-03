const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["volume"],
    description: "ปรับระดับเสียงเพลง",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "ปรับระดับเสียงของเพลงจาก 0 ถึง 100",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ จะไปปรับเสียงอะไรอ่ะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
        if (interaction.user.id !== player.queue.current.requester.id ) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

        const value = interaction.options.getInteger("amount");
        if (!value) return interaction.editReply(`🔈 ปริมาณเสียงปัจจุบันคือ: **${player.volume}%**`);

        await player.setVolume(Number(value));

        const embed = new EmbedBuilder()
            .setDescription(`🔊 ปรับเสียงไปที่ระดับ: **${value}%**`)
            .setColor(client.color);
        
        return interaction.editReply({ content: " ",  embeds: [embed] });
    }
}