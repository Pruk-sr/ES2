const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const prettyBytes = require("pretty-bytes");

module.exports = {
    name: ["lavalink"],
    description: "รับสถานะการทำงานของ Lavalink",
    category: "Misc",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `LavaLink`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setDescription(`\`\`\`nim\n${[...client.manager.shoukaku.nodes.values()].map((node) => `Node         :: ${node.state === 1 ? "🟢" : "🔴"} ${node.name}\nConnections  :: ${node.stats.players}\nplayingPlayers  :: ${node.stats.playingPlayers}\nUptime    :: ${moment.duration(node.stats.uptime).format("d [days], h [hours], m [minutes], s [seconds]")}\n Cores    :: ${node.stats.cpu.cores + " Core(s)"}\nMemory     :: ${prettyBytes(node.stats.memory.used)}/${prettyBytes(node.stats.memory.reservable)}\nSystemload    :: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%\nLavalinkLoad     :: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`).join("\n\n------------------------------------------------------------\n\n")}\`\`\``)
            return interaction.editReply({ embeds: [embed] });
        }
}