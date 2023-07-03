const { EmbedBuilder, version } = require("discord.js");
const os = require('os');
const { stripIndent } = require("common-tags");
const si = require("systeminformation");
const pretty = require("prettysize");
const kazagumoversion = require("kazagumo").version;

module.exports = {
    name: ["status"],
    description: "Display the Host stats",
    category: "Misc",
    owner: true,
    run: async (client, interaction) => {
      await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const totalSeconds = os.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);
        // CPU
        let memdata = await si.mem();
        let diskdata = await si.fsSize();
        let cpudata = await si.cpu();
        let cl = await si.currentLoad();

        
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Host Status', iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                {
                  name: "CPU",
                  value: stripIndent`
                  ❯ **Cores:** ${cpudata.cores}
                  ❯ **Usage:** ${cl.currentLoad.toFixed(2)}%
                  `,
                  inline: true,
                },
                {
                  name: "RAM",
                  value: stripIndent`
                  ❯ **Bot:** ${pretty(process.memoryUsage().heapUsed)}
                  ❯ **Available:** ${pretty(memdata.total)}
                  `,
                  inline: true,
                },
                {
                  name: "DISK",
                  value: stripIndent`
                  ❯ **Used:** ${pretty(diskdata[0].size)}
                  ❯ **Available:** ${pretty(diskdata[0].used)}
                  `,
                  inline: true,
                },
                {
                  name: "Node Js version",
                  value: stripIndent`
                  ❯ ${process.versions.node}
                  `,
                  inline: true,
                },
                {
                    name: "Discord.js version",
                    value: stripIndent`
                    ❯ ${version}
                    `,
                    inline: true,
                },
                {
                    name: "kazagumo version",
                    value: stripIndent`
                    ❯ ${kazagumoversion}
                    `,
                    inline: true,

                },
                {
                    name: "Uptime",
                    value: stripIndent`
                    ❯ ${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds
                    `,
                    inline: false,
                },
              )
            .setTimestamp()
            .setColor(client.color);
        await interaction.editReply({ content: ` `, embeds: [embed]});   
    }
};