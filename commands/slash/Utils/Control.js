const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
module.exports = { 
  name: ["settings", "control"],
  description: "Enable or disable the player control",
  category: "Utils",
  options: [
      {
          name: "type",
          description: "Choose enable or disable",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
              {
                  name: "Enable",
                  value: "enable"
              },
              {
                  name: "Disable",
                  value: "disable"
              }
          ]
      }
  ],
run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`คุณต้องมีความสามารถ MANAGE_GUILD เพื่อใช้คำสั่ง`);
            const Control = await GControl.findOne({ guild: interaction.guild.id });
            if(interaction.options.getString('type') === "enable") {

                await client.db.set(`control.guild_${interaction.guild.id}`, "enable")

                const embed = new EmbedBuilder()
                    .setDescription(`🔧 ${เปิดใช้งาน} โหมดควบคุมผู้เล่น`)
                    .setColor(client.color)

                return interaction.editReply({ embeds: [embed] });
            }

            else if(interaction.options.getString('type') === "disable") {
                await client.db.set(`control.guild_${interaction.guild.id}`, "enable")
                const embed = new EmbedBuilder()
                .setDescription(`🔧 ${ปิดใช้งาน} โหมดควบคุมผู้เล่น`)
                .setColor(client.color)

                return interaction.editReply({ embeds: [embed] });
            }
    }
};