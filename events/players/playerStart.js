const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, } = require("discord.js");
const formatDuration = require('../../structures/FormatDuration.js');
const { QueueDuration } = require("../../structures/QueueDuration.js");


module.exports = async (client, player, track) => {
  try {
  const guild = await client.guilds.cache.get(player.guildId)
  client.logger.info(`Player Started in @ ${guild.name} / ${player.guildId}`);

  let Control = await client.db.get(`control.guild_${player.guildId}`)
  if (!Control) {
    await client.db.set(`control.guild_${player.guildId}`, "disable")
    Control = client.db.get(`control.guild_${player.guildId}`)
  }

  if (!player) return;

  /////////// Update Music Setup ///////////

  await client.UpdateQueueMsg(player);

  /////////// Update Music Setup ///////////

  const channel = client.channels.cache.get(player.textId);
  if (!channel) return;

  let data = await client.db.get(`setup.guild_${channel.guild.id}`)
  if (player.textChannel === data.channel) return;

  const song = player.queue.current;
  const TotalDuration = formatDuration(player)
  const Part = Math.floor(player.position / song.length * 30);
  const Emoji = player.playing ? "🔴 |" : "⏸ |";
  const CurrentDuration = formatDuration(player.position);
  const position = player.shoukaku.position

  if (Control === 'disable') return
  const embeded = new EmbedBuilder()
    .setAuthor({ name: `กำลังเล่น เพลง...`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
    .setDescription(`**[${track.title}](${track.uri})**`)
    .setColor(client.color)
    .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/hqdefault.jpg`)
    .addFields([
      { name: `author_title:`, value: `${song.author}`, inline: true },
      { name: `request_title:`, value: `${song.requester}`, inline: true },
      { name: `volume_title:`, value: `${player.volume * 100}%`, inline: true },
      { name: `queue_title:`, value: `${player.queue.length}`, inline: true },
      { name: `duration_title:`, value: `${formatDuration(song.length, true)}`, inline: true },
      { name: `total_duration_title:`, value: `${formatDuration(TotalDuration)}`, inline: true },
      { name: `ดาวน์โหลด:`, value: `**[${song.title} - y2mate.com](https://www.y2mate.com/youtube/${song.identifier})**`, inline: false },
      {name: `🕒 ระยะเวลา: \`[0:00 / ${TotalDuration}]\``, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``, inline: false},
    ])
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents([
      new ButtonBuilder()
        .setCustomId("pause")
        .setEmoji("⏯")
        .setStyle("Success"),

      new ButtonBuilder()
        .setCustomId("replay")
        .setEmoji("⬅")
        .setStyle("Primary"),

      new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji("✖")
        .setStyle("Danger"),

      new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji("➡")
        .setStyle("Primary"),

      new ButtonBuilder()
        .setCustomId("loop")
        .setEmoji("🔄")
        .setStyle("Success")
    ])

  const row2 = new ActionRowBuilder()
    .addComponents([
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setEmoji("🔀")
        .setStyle("Success"),

      new ButtonBuilder()
        .setCustomId("voldown")
        .setEmoji("🔉")
        .setStyle("Primary"),

      new ButtonBuilder()
        .setCustomId("clear")
        .setEmoji("🗑")
        .setStyle("Danger"),

      new ButtonBuilder()
        .setCustomId("volup")
        .setEmoji("🔊")
        .setStyle("Primary"),

      new ButtonBuilder()
        .setCustomId("queue")
        .setEmoji("📋")
        .setStyle("Success")
    ])

  const nplaying = await client.channels.cache.get(player.textId).send({ embeds: [embeded], components: [row, row2] });

  const filter = (message) => {
    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
    else {
      message.reply({ content: `คุณต้องอยู่ใน ห้องเสียง/เดียวกันนะ เพื่อจะใช้ปุ่มนี้`, ephemeral: true });
    }
  };
  const collector = nplaying.createMessageComponentCollector({ filter, time: song.length });

  collector.on('collect', async (message) => {
    const id = message.customId;
    if (id === "pause") {
      if (!player) {
        collector.stop();
      }
      await player.pause(!player.paused);
      const uni = player.paused ? `หยุดชั่วคราว` : `ดำเนินการต่อ`;


      const embed = new EmbedBuilder()
        .setDescription(`⏸ เพลงกำลัง ${uni} แล้วคะ`)
        .setColor(client.color);

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "skip") {
      if (!player) {
        collector.stop();
      }
      await player.skip();

      const embed = new EmbedBuilder()
        .setDescription(`⏭ ข้ามแล้วคะและกำลังจะเริ่มเล่นเพลงใหม่ในคิว`)
        .setColor(client.color);

      await nplaying.edit({ embeds: [embeded], components: [] });
      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "stop") {
      if (!player) {
        collector.stop();
      }

      await player.destroy();

      const embed = new EmbedBuilder()
        .setDescription(`🚫 ◀️ ฉันออกมาจากช่อง\`${channel.name}\` แล้วคะ`)
        .setColor(client.color);

      await nplaying.edit({ embeds: [embeded], components: [] });
      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "shuffle") {
      if (!player) {
        collector.stop();
      }
      await player.queue.shuffle();

      const embed = new EmbedBuilder()
        .setDescription(`🔀 เริ่มสับเปลี่ยนคิวแล้ว...`)
        .setColor(client.color);

      message.reply({ embeds: [embed], ephemeral: true });
    } else if (id === "loop") {
      if (!player) {
        collector.stop();
      }
      const loop_mode = {
        none: "none",
        track: "track",
        queue: "queue"
      }

      if (player.loop === "queue") {
        await player.setLoop(loop_mode.none)

        const unloopall = new EmbedBuilder()
          .setDescription(`🔁 **ยกเลิก**ทำซ้ำคิวปัจจุบัน`)
          .setColor(client.color);
        return await message.reply({ content: ' ', embeds: [unloopall] });
      } else if (player.loop === "none") {
        await player.setLoop(loop_mode.queue)
        const loopall = new EmbedBuilder()
          .setDescription(`🔁 ทำซ้ำคิวปัจจุบัน`)
          .setColor(client.color);
        return await message.reply({ content: ' ', embeds: [loopall] });
      }
    } else if (id === "volup") {
      if (!player) {
        collector.stop();
      }

      const embed = new EmbedBuilder()
        .setDescription(`🔊 ปรับเสียงไปที่ระดับ: **${(player.volume * 100) + 10}%**}`)
        .setColor(client.color);

      if (player.volume * 100 == 100) return message.reply({ embeds: [embed], ephemeral: true });

      await player.setVolume((player.volume * 100) + 10);
      message.reply({ embeds: [embed], ephemeral: true });
    }
    else if (id === "voldown") {
      if (!player) {
        collector.stop();
      }

      const embed = new EmbedBuilder()
        .setDescription(`🔈 ปรับเสียงไปที่ระดับ: **${(player.volume * 100) - 10}%**}`)
        .setColor(client.color);

      if (player.volume * 100 == 0) return message.reply({ embeds: [embed], ephemeral: true });

      await player.setVolume((player.volume * 100) - 10);

      message.reply({ embeds: [embed], ephemeral: true });
    }
    else if (id === "replay") {
      if (!player) {
        collector.stop();
      }
      await player.send({ op: "seek", guildId: message.guild.id, position: 0 });

      const embed = new EmbedBuilder()
        .setDescription(`🔁 ทำซ้ำเพลงปัจจุบัน`)
        .setColor(client.color);

      message.reply({ embeds: [embed], ephemeral: true });
    }
    else if (id === "queue") {
      if (!player) {
        collector.stop();
      }
      const song = player.queue.current;
      const qduration = `${formatDuration(song.length)}`;
      const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;

      let pagesNum = Math.ceil(player.queue.length / 10);
      if (pagesNum === 0) pagesNum = 1;

      const songStrings = [];
      for (let i = 0; i < player.queue.length; i++) {
        const song = player.queue[i];
        songStrings.push(
          `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\`
            `);
      }

      const pages = [];
      for (let i = 0; i < pagesNum; i++) {
        const str = songStrings.slice(i * 10, i * 10 + 10).join('');

        const embed = new EmbedBuilder()
          .setAuthor({ name: `คิว - ${message.guild.name}}`, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(thumbnail)
          .setColor(client.color)
          .setDescription(`**เพลงที่กำลังเล่น**\n**[${song.title}](${song.uri})** [${formatDuration(player.position)}] • ${song.requester}\n\n**คิวที่เหลือ**:${str == '' ? '  Nothing' : '\n' + str}`)
          .setFooter({ text: `หน้า • ${i + 1}/${pagesNum} | ${player.queue.length} • เพลง | ระยะเวลาทั้งหมด • ${qduration}}`});
        pages.push(embed);
      }
      message.reply({ embeds: [pages[0]], ephemeral: true });
    }
    else if (id === "clear") {
      if (!player) {
        collector.stop();
      }
      await player.queue.clear();

      const embed = new EmbedBuilder()
        .setDescription(`✅ คิวเพลงถูกเคลียเเล้ว`)
        .setColor(client.color);

      message.reply({ embeds: [embed], ephemeral: true });
    }
  });
  collector.on('end', async (collected, reason) => {
    if (reason === "time") {
      nplaying.edit({ embeds: [embeded], components: [] })
    }
  });
} catch (e) {
  console.log(e);
}
}
