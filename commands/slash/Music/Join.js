const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = { 
    name: ["join"],
    description: "Summon the bot to your voice channel.",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const { channel } = interaction.member.voice;
        if (!channel) return interaction.editReply(`❓ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าช่องไหน =3=`);
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 คุณยังไม่สามารถใช้งานคำสั่งนี้ได้ในขณะนี้ เนื่องจากมีสมาชิกอื่นกำลังเล่นเพลงอยู่คะ');
        client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const embed = new EmbedBuilder()
            .setDescription(`✅ ฉันอยู่ในช่อง \`${channel.name}\` เรียบร้อยแล้วค้าา...`)
            .setColor(client.color)

        return interaction.editReply({ embeds: [embed] })
    }
}
