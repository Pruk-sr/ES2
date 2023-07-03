const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["loop"],
    description: "สลับโหมดของการเล่นเพลงซ้ำ!",
    category: "Music",
    options: [
        {
            name: "mode",
            description: "โหมดการตั้งค่าการทำซ้ำเป็น?",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Current 🔂",
                    value: "ทำซ้ำในเพลง"
                },
                {
                    name: "Queue 🔁",
                    value: "ทำซ้ำในคิว"
                }
            ]
        }
    ],
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });
		const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.editReply(`❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ`);
		if (interaction.user.id !== player.queue.current.requester.id) return await interaction.editReply('🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ')

		const choice = interaction.options.getString("mode");

		if (choice == 'current') {
			if (player.loop === "none") {
				player.setLoop("track");

				const embed = new EmbedBuilder()
					.setDescription(`🔁 ทำซ้ำเพลงปัจจุบัน`)
					.setColor(client.color);

				interaction.editReply({ content: " ", embeds: [embed] });
			} else {
				player.setLoop("none")

				const embed = new EmbedBuilder()
					.setDescription(`🔁 **ยกเลิก**ทำซ้ำเพลงปัจจุบัน`)
					.setColor(client.color);

				interaction.editReply({ content: " ", embeds: [embed] });
			}
		} else if (choice == 'queue') {
			if (player.loop === "queue") {
				player.setLoop("none")

				const embed = new EmbedBuilder()
					.setDescription(`🔁 **ยกเลิก**ทำซ้ำคิวปัจจุบัน`)
					.setColor(client.color);

				interaction.editReply({ content: " ", embeds: [embed] });
			} else {
				player.setLoop("queue")

				const embed = new EmbedBuilder()
					.setDescription(`🔁 ทำซ้ำคิวปัจจุบัน`)
					.setColor(client.color);

				interaction.editReply({ content: " ", embeds: [embed] });
			}
		}
	}
};