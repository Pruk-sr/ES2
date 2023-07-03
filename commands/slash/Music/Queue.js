const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { NormalPage } = require('../../../structures/PageQueue.js');
const formatDuration = require('../../../structures/FormatDuration.js');

module.exports = { 
    name: ["queue"],
    description: "ตรวจสอบเพลงในคิว",
    category: "Music",
    options: [
        {
            name: "page",
            description: "จำนวนหน้าของคิวเพลง",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });

		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
        const { channel } = interaction.member.voice;

        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...`);
        
		if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

		const args = interaction.options.getInteger("page");

		const song = player.queue.current;
		const qduration = formatDuration(player.queue.durationLength + song.length);

		let pagesNum = Math.ceil(player.queue.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 0; i < player.queue.length; i++) {
			const song = player.queue[i];
			songStrings.push(
				`**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\` • ${song.requester}
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');

			const embed = new EmbedBuilder()
                .setAuthor({ name: `คิวเพลงของ - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
				.setColor(client.color)
				.setDescription(`**เพลงปัจจุบัน**\n[${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\` • ${song.requester}\n\n**คิวเพลงที่เหลืออยู่**:${str == '' ? '  Nothing' : '\n' + str}`)

			if (song.thumbnail) {
				embed.setThumbnail(song.thumbnail);
			} else {
				embed.setThumbnail(client.user.displayAvatarURL());
			}

			pages.push(embed);
		}

		if (!args) {
			if (pages.length == pagesNum && player.queue.length > 10) NormalPage(client, interaction, pages, 60000, player.queue.length, qduration);
			else return interaction.editReply({ embeds: [pages[0]] });
		} else {
			if (isNaN(args)) return interaction.editReply(`หน้า ต้องเป็นตัวเลขเท่านั้นคะ`);
			if (args > pagesNum) return interaction.editReply(`มีเพียง ${pagesNum} หน้า`);
			const pageNum = args == 0 ? 1 : args - 1;
			return interaction.editReply({ embeds: [pages[pageNum]] });
		}
	}
};