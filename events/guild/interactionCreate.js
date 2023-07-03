const { Events, ChannelType, InteractionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const ytsr = require("@distube/ytsr");
const { SEARCH_DEFAULT } = require("../../settings/config.js")
const { BitwisePermissionFlags } = require("../../plugins/clientUtils.js");

module.exports = async(client, interaction) => {
    try{
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.channel.type === ChannelType.DM) return;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
			return await interaction.reply({ "content": "🚫 อืมม...ดูเหมือนว่าคุณไม่มีสิทธิ์ในการใช้งานคำสั่งแอปพลิเคชั่น (/) นะคะ ลองสอบถามผู้ดูแลดูนะคะ (≧∇≦)", "ephemeral": true });
		}

        let subCommandName = "";
        try {
            subCommandName = interaction.options.getSubcommand();
        } catch { };
        let subCommandGroupName = "";
        try {
            subCommandGroupName = interaction.options.getSubcommandGroup();
        } catch { };
		if (interaction.user.bot) return;

        const commandName = interaction.commandName;
        const command = client.Slash.get(commandName);
        
        if (command && command.permissions) {
        
            if (!interaction.member.permissions.has(command.permissions.user)) {
					try {
						return await interaction.reply({ "content": `🚫 ฉันไม่สามารถให้คุณใช้งานคำสั่งนี้ได้ หากคุณยังไม่มีการอนุญาตเหล่านี้: **${command.permissions.user.map(permission => BitwisePermissionFlags[permission]).join(", ")}**`, "ephemeral": true });
					} catch (error) {
						return console.log(error);
					}
			}
            if (!interaction.guild.members || !interaction.guild.members.me || !interaction.guild.members.me.permissions.has(command.permissions.client)) {
					try {
						return await interaction.member.send({ "content": `🚫 เอิ่มม..ฉันขาดการอนุญาตบางอย่าง เลยทำให้ฉันไปต่อไม่ได้ ได้แก่: **${command.permissions.client.map(permission => BitwisePermissionFlags[permission]).join(", ")}**`, "ephemeral": true });
					} catch (error) {
						return console.log(error);
					}
				}
			}

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const Random = SEARCH_DEFAULT[Math.floor(Math.random() * SEARCH_DEFAULT.length)];
            if(interaction.commandName == "play") {
                let choice = []
                await ytsr(interaction.options.getString("search") || Random, { safeSearch: true, limit: 10 }).then(result => {
                    result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
                });
                return await interaction.respond(choice).catch(() => { });
            } else if (interaction.options.getSubcommand() == "playskip") {
                let choice = []
                await ytsr(interaction.options.getString("search") || Random, { safeSearch: true, limit: 10 }).then(result => {
                    result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
                });
                return await interaction.respond(choice).catch(() => { });
            } else if (interaction.options.getSubcommand() == "playtop") {
                let choice = []
                await ytsr(interaction.options.getString("search") || Random, { safeSearch: true, limit: 10 }).then(result => {
                    result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) })
                });
                return await interaction.respond(choice).catch(() => { });
            }
        }
        const Slashcommand = client.Slash.find(Slashcommand => {
            switch (Slashcommand.name.length) {
            case 1: return Slashcommand.name[0] == interaction.commandName;
            case 2: return Slashcommand.name[0] == interaction.commandName && Slashcommand.name[1] == subCommandName;
            case 3: return Slashcommand.name[0] == interaction.commandName && Slashcommand.name[1] == subCommandGroupName && Slashcommand.name[2] == subCommandName;
            }
        });

        
        if (!Slashcommand) return;
        const warning = new EmbedBuilder().setColor(client.color).setTimestamp();
        
        if (Slashcommand.owner && interaction.user.id !== client.ownerID) {
            await warning.setDescription(`🛑 อย่านะ..ไม่เอาๆ ฟังก์ชันนี้ต้องใช้สิทธิ์ระดับบนเท่านั้นนะ`);

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }
        if (Slashcommand) {
            try {
                Slashcommand.run(client, interaction);
            } catch (error) {
                if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ "content": "❌ เกิดข้อผิดพลาดขณะดำเนินการคำสั่งนี้!", "ephemeral": true });
				} else {
					await interaction.reply({ "content": "❌ เกิดข้อผิดพลาดขณะดำเนินการคำสั่งนี้!", "ephemeral": true });
				}
                client.logger.error(error);
            }
        }

    }
} catch (error) {
    client.logger.error(error)
}
}
