const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["autoplay"],
    description: "เปิด/ปิดการเล่นเพลงอัตโนมัติ",
    category: "Music",
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`❎ อืมม...แต่ว่าเพลงมันยังไม่ได้เริ่มเล่นเลยนะ?`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')
        const currentsong = player.queue.current.uri;


        const ytUri = /^(https?:\/\/)?(www\.)?(m\.)?(music\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(currentsong.uri);
        if (!ytUri) {
            const embed = new EmbedBuilder().setDescription(`🚫 โหมดการเล่นอัตโนมัติรองรับ Youtube เท่านั้น!`).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }
        if (player.data.get("autoplay")) {
            await player.data.set("autoplay", false);
            await player.queue.clear();

            const embed = new EmbedBuilder()
                .setDescription("📻 ปิดโหมดการเล่นอัตโนมัติแล้ว")
                .setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, { requester: interaction.user });
            if (!res.tracks.length) return interaction.editReply(`🚫 โหมดการเล่นอัตโนมัติรองรับ Youtube เท่านั้น!`);

            await player.data.set("autoplay", true);
            await player.data.set("requester", interaction.user);
            await player.data.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const embed = new EmbedBuilder()
                .setDescription("📻 เปิดโหมดการเล่นอัตโนมัติแล้ว")
                .setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }
    }
};