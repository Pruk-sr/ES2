const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField, ChannelType, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = { 
  name: ["settings", "status"],
  description: "Create bot status channel",
  category: "Utils",
  options: [
      {
          name: "type",
          description: "Type of channel",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
              {
                  name: "Create",
                  value: "create"
              },
              {
                  name: "Delete",
                  value: "delete"
              }
          ]
      },
  ],
run: async (client, interaction) => {
        await interaction.reply({ content: "กำลังโหลดโปรดรอสักครู่", ephemeral: true });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`คุณต้องมีความสามารถ MANAGE_GUILD เพื่อใช้คำสั่ง`);
            if(interaction.options.getString('type') === "create") {
                const textChannel = await interaction.guild.channels.create({
                    name: "bot-status",
                    type: ChannelType.GuildText,
                    user_limit: 3,
                    rate_limit_per_user: 3, 
                })

                const info = new EmbedBuilder()
                  .setTitle(client.user.tag + " Status")
                  .addFields([
                      { name: 'Uptime', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
                      { name: 'WebSocket Ping', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
                      { name: 'Memory', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
                      { name: 'Guild Count', value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``, inline: true },
                      { name: 'User Count', value: `\`\`\`${client.users.cache.size} users\`\`\``, inline: true },
                      { name: 'Node', value: `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, inline: true },
                      { name: 'Cached Data', value: `\`\`\`${client.users.cache.size} users\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
                      { name: 'Discord.js', value: `\`\`\`${version}\`\`\``, inline: true },
                  ])
                  .setTimestamp()
                  .setColor(client.color);

                const channel_msg = await textChannel.send({ content: ``, embeds: [info] })

                const data = {
                    guild: interaction.guild.id,
                    enable: true,
                    channel: textChannel.id,
                    statmsg: channel_msg.id,
                }
                await client.db.set(`status.guild_${interaction.guild.id}`, data)

                const embed = new EmbedBuilder()
                    .setDescription(`สร้างช่อง ${textChannel} สำเร็จ \nคำเตือน: ห้ามลบอะไรก็ตามแต่ที่บอทได้ส่งทิ้งไว้! (เพื่อให้บอทยังทำงานได้! ถ้าลบไปแล้วให้สร้างใหม่)`)
                    .setColor(client.color);
                    return interaction.followUp({ embeds: [embed] });
                }

                if(interaction.options.getString('type') === "delete") {
                    const SetupChannel = await client.db.get(`status.guild_${interaction.guild.id}`)

                    const embed_none = new EmbedBuilder()
                        .setDescription(`ลบช่อง ${undefined} สำเร็จ`)
                        .setColor(client.color);

                    if (!SetupChannel) return interaction.editReply({ embeds: [embed_none] });

                    const fetchedTextChannel = interaction.guild.channels.cache.get(SetupChannel.channel)

                    const embed = new EmbedBuilder()
                        .setDescription(`ลบช่อง ${fetchedTextChannel} สำเร็จ}`)
                        .setColor(client.color);

                    await interaction.editReply({ embeds: [embed] });

                    if (fetchedTextChannel) await fetchedTextChannel.delete();

                    const deleted_data = {
                        guild: interaction.guild.id,
                        enable: false,
                        channel: "",
                        statmsg: "",
                    }

                    return client.db.set(`status.guild_${interaction.guild.id}`, deleted_data)
        }
    }
};