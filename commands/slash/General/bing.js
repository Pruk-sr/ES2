const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Chat = require('../../../plugins/Chat.js');
var timeout = [];

module.exports = { 
    name: ["bing"],
    description: "ถาม/ตอบกับบอท.",
    category: "General",
    options: [
        {
            name: "message",
            type: ApplicationCommandOptionType.String,
            description: "ข้อความที่ต้องการ",
            required: true,
        }
    ],

    run: async (client, interaction) => {
        try {
            if (timeout.includes(interaction.guild.id)) return await interaction.reply({ content: "กำลังโหลดโปรดรอสักครู่", ephemeral: true });
            await interaction.deferReply({ ephemeral: false, fetchReply: true });
            timeout.push(interaction.guild.id)
            setTimeout(() => {
                timeout.shift();
            }, 70000);
            let data = await Chat(interaction.options.getString("message"));
            const regex = /\[\^.+?\^\]/g;
            if(!data) return interaction.editReply({ content: `:x: ERROR | เกิดข้อผิดพลาดขึ้น` });

            let message = data.item.messages[1].text
            let beta = data.item.messages[1].sourceAttributions;
            const cleanedMessage = message.replace(regex, '');
            let embed = new EmbedBuilder()
            .setColor("#00FFFF")
            let Link = [];
            beta.forEach((beta, i) => {
                if (i < 5) {
                Link.push(`${i+1}. [${beta.providerDisplayName}](${beta.seeMoreUrl})`)
            }
            })

            embed.setDescription(Link.join("\n"))
            interaction.editReply({ content: `${cleanedMessage.substr(0, 250)}`, embeds: [embed] })
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};