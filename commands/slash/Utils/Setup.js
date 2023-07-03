const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = { 
  name: ["settings", "setup"],
  description: "Setup channel song request",
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
    try {
        await interaction.deferReply({ ephemeral: false });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`คุณต้องมีความสามารถ MANAGE_GUILD เพื่อใช้คำสั่ง`);
            if(interaction.options.getString('type') === "create") {


                const textChannel = await interaction.guild.channels.create({
                    name: "song-request",
                    type: ChannelType.GuildText,
                    topic: `⏯ *หยุดชั่วคราว/ดำเนินการต่อ ของเพลง*\n⬅ *กลับไปเพลงก่อนหน้า*\n⏹ *ปิดเพลง/เอาบอทออกจากห้อง*\n➡ *ข้ามไปเพลงต่อไป*\n🔁 *เล่นเพลงซ้ำ/ยกเลิกเล่นเพลงซ้ำ`,
                    user_limit: 3,
                    rate_limit_per_user: 3, 
                })
                const queueMsg = `**__คิวทั้งหมด:__**\nเข้าห้องพูดคุยแล้วเพิ่มเพลงโดย ใช้ชื่อหรือลิ้งเพลง ในห้องนี้`;

                const playEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `ไม่มีเพลง เล่นอยู่ ในปัจจุบัน` })
                    .setImage(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpeg?size=300`)
                    .setDescription(`>>> [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands) | [Support](https://discord.gg) | [Website](https://google.com)}`)
                    .setFooter({ text: `Prefix is: / (SlashCommand)` });

                const channel_msg = await textChannel.send({ content: `${queueMsg}`, embeds: [playEmbed], components: [client.diSwitch] })

                const new_data = {
                    guild: interaction.guild.id,
                    enable: true,
                    channel: textChannel.id,
                    playmsg: channel_msg.id,
                }

                await client.db.set(`setup.guild_${interaction.guild.id}`, new_data)

                const embed = new EmbedBuilder()
                    .setDescription(`*สร้างระบบ แชทเพลง สำเร็จ* ${textChannel}\nคำเตือน: ห้ามลบอะไรก็ตามแต่ที่บอทได้ส่งทิ้งไว้! (เพื่อให้บอทยังทำงานได้! ถ้าลบไปแล้วให้สร้างใหม่)}`)
                    .setColor(client.color);
                    return interaction.followUp({ embeds: [embed] });
                }

                if(interaction.options.getString('type') === "delete") {
                    const SetupChannel = await client.db.get(`setup.guild_${interaction.guild.id}`)

                    const embed_none = new EmbedBuilder()
                    .setDescription(`*ลบ ${undefined} ช่องสำเร็จแล้ว!*`)
                        .setColor(client.color);

                    if (!SetupChannel) return interaction.editReply({ embeds: [embed_none] });

                    const fetchedTextChannel = interaction.guild.channels.cache.get(SetupChannel.channel)
                    const fetchedVoiceChannel = interaction.guild.channels.cache.get(SetupChannel.voice)
                    const fetchedCategory = interaction.guild.channels.cache.get(SetupChannel.category)

                    const embed = new EmbedBuilder()
                    .setDescription(`*ลบ ${fetchedTextChannel} ช่องสำเร็จแล้ว!*`)
                        .setColor(client.color);


                    if (fetchedCategory) await fetchedCategory.delete()
                    if (fetchedVoiceChannel) await fetchedVoiceChannel.delete()
                    if (fetchedTextChannel) await fetchedTextChannel.delete();

                    const deleted_data = {
                        guild: interaction.guild.id,
                        enable: false,
                        channel: "",
                        playmsg: "",
                        voice: "",
                        category: ""
                    }

                    await client.db.set(`setup.guild_${interaction.guild.id}`, deleted_data)

                    return interaction.editReply({ embeds: [embed] });
        }
    } catch (error) {
    console.log(error)
}
}
};