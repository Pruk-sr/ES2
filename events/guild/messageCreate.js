const { PermissionsBitField, EmbedBuilder } = require("discord.js");
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === 1) return;
    let prefix = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [ matchedPrefix ] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return message.author.dmChannel.send(`${message.author}, I don't have permission to send messages in ${message.guild.name}!`);
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(`${message.author}, I don't have permission to embed links in ${message.guild.name}!`);

        const embed = new EmbedBuilder()
            .setColor('Red')
    try {
      if (command.ownerOnly && message.author.id !== `${client.owner}`) {
        embed.setDescription(`Only <@${client.owner}> Can Use this Command`);
        return message.channel.send({ embeds: [embed] });
     }
    if (command.botPerms) {
      if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
          embed.setDescription(`I don't have **\`${command.botPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`);
          return message.channel.send({ embeds: [embed] });
      }
     }
    if (command.userPerms) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
          embed.setDescription(`You don't have **\`${command.userPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`);
          return message.channel.send({ embeds: [embed] });
      }
  }
    if (command.nsfw && !message.channel.nsfw) {
      embed.setDescription(`This command can only be used in **NSFW** channels!`);
      return message.channel.send({ embeds: [embed] });
    }
    if (command.args && !args.length) {
        let reply = `${message.author}, You didn't provide any arguments!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.config.name} ${command.config.usage}\``;
        }
        return message.channel.send(reply);
    }
    } catch (error) {
      console.log(error)
      await message.channel.send(`${message.author}, an error occured!`);
    }
    try {
      command.run(client, message, args, prefix);
    } catch (error) {
      console.log(error)
      await message.channel.send(`${message.author}, an error occured!`);
    }
}