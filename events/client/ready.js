const { ActivityType, EmbedBuilder, version} = require("discord.js");
const {  version: kazagumo, } = require("kazagumo")
const ms = require('pretty-ms');
const { currencyFormatter } = require("../../plugins/clientUtils");
const moment = require("moment");
require("moment-duration-format");
const prettyBytes = require("pretty-bytes");

module.exports = async (client) => {
  try{
  require("../../plugins/autoDeploy.js")(client)
  client.logger.info(`Loading AutoDeploy Plugin infofully`);
 
  client.cluster.triggerReady();
  const commandSize = client.commands.size;


  const promises = [
    client.cluster.broadcastEval("this.guilds.cache.size"),
    client.cluster.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
  ];


const results = await Promise.all(promises);

const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
const members = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

  const activities = {
    "production": [
      {
      "name": client.cluster.info.TOTAL_SHARDS + "Shard",
      "type": ActivityType.Playing
    },
    {
      "name": "Elysia is so beautiful",
      "type": ActivityType.Watching
    },
    {
      "name": currencyFormatter(members, 1) + " Member" + (members === 1 ? "" : "s"),
      "type": ActivityType.Watching
    },
    {
      "name": currencyFormatter(servers, 1) + " Server" + (servers === 1 ? "" : "s"),
      "type": ActivityType.Watching
    },
    {
      "name": currencyFormatter(commandSize, 1) + " Command" + (commandSize === 1 ? "" : "s"),
      "type": ActivityType.Listening
    },
    {
      "name": "Elysia",
      "type": ActivityType.Playing
    }
]
};
  const activityType = activities.production

  client.user.setPresence({
    "status": "dnd",
    "afk": false,
    "activities": activityType
  });
  setInterval(async () => {
    let totalGuilds = 0, totalMembers = 0;

    if (client.cluster && client.cluster.count) {
      const promises = [
        client.cluster.fetchClientValues("guilds.cache.size"),
        client.cluster.broadcastEval(script => script.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
      ];
      const results = await Promise.all(promises);

      totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
    } else {
      totalGuilds = client.guilds.cache.size;
      totalMembers = client.users.cache.size;
    }

    const randomIndex = Math.floor(Math.random() * activityType.length);
    const newActivity = activityType[randomIndex];

    activities.production[0].name = currencyFormatter(totalGuilds, 1) + " Server" + (totalGuilds === 1 ? "" : "s");
    activities.production[2].name = currencyFormatter(totalMembers, 1) + " Member" + (totalMembers === 1 ? "" : "s");
    client.user.setActivity(newActivity);
  }, 5000);





  
  const info = setInterval(async () => {
    const SetupChannel = new Map()
    const prepare = await client.db.get(`status`)
    if (!prepare) return
    Object.keys(prepare).forEach(async (key, index) => {
        if (prepare[key].enable == true) {
            SetupChannel.set(prepare[key].guild, {
                channel: prepare[key].channel,
                category: prepare[key].category,
                statmsg: prepare[key].statmsg
            })
        }
    })

    if (!SetupChannel) return
    const fetched_info = new EmbedBuilder()
      .setTitle(client.user.tag + " Status")
      .setDescription(`\`\`\`nim\n${[...client.manager.shoukaku.nodes.values()].map((node) => `Node         :: ${node.state === 1 ? "🟢" : "🔴"} ${node.name}\nConnections  :: ${node.stats.players}\nPlaying      :: ${node.stats.playingPlayers}\nUptime       :: ${moment.duration(node.stats.uptime).format("d [D], h [H], m [M], s [S]")}\nCores        :: ${node.stats.cpu.cores + " Core(s)"}\nMemory       :: ${prettyBytes(node.stats.memory.used)}/${prettyBytes(node.stats.memory.reservable)}\nSystemload   :: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%\nLavalinkLoad :: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`).join("\n\n------------------------------------------------------------\n\n")}\`\`\``)
      .addFields([
          { name: 'Uptime', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
          { name: 'WebSocket Ping', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
          { name: 'Memory', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
          { name: 'Node', value: `\`\`\`${process.version}\`\`\``, inline: true },
          { name: 'Discord.js', value: `\`\`\`${version}\`\`\``, inline: true },
          { name: 'kazagumo', value: `\`\`\`${kazagumo}\`\`\``, inline: true },
          { name: 'Total User - Guilds', value: `\`\`\`${client.users.cache.size} users\n${client.guilds.cache.size} guilds\`\`\``, inline: true },
          { name: 'Total Channels - Emojis', value: `\`\`\`${client.channels.cache.size} channels\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
        ])
      .setTimestamp()
      .setColor(client.color);

      SetupChannel.forEach(async (g) => {
        const fetch_channel = await client.channels.fetch(g.channel)
        const interval_text = await fetch_channel.messages.fetch(g.statmsg)
        if (!fetch_channel) return
        await interval_text.edit({ content: ``, embeds: [fetched_info] })
      })

  }, 10000)

client.interval.set("MAIN", info)


    client.startup.end = new Date().getTime();
    client.logger.info("Logged in as " + (client.user.username) + " (ID: " + (client.user.id) + ")" +  "is Ready: " + (((client.startup.end - client.startup.start) / 1000) + "s"));
} catch (e) {
  client.logger.error(e)
}
}

