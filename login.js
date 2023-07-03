const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins } = require("kazagumo");
const Nico = require("kazagumo-nico");
const deezer = require("kazagumo-deezer");
const Spotify = require("kazagumo-spotify");
const logger = require("./plugins/logger");
const colors = require("colors");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");


const startTime = new Date().getTime();

const client = new Client({
  shards: getInfo().SHARD_LIST, // An array of shards that will get spawned
  shardCount: getInfo().TOTAL_SHARDS, // Total number of shards
  failIfNotExists: true,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: true
},
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
],
});
client.api = {};
client.config = require("./settings/config.js");
client.prefix = client.config.PREFIX;
client.ownerID = client.config.OWNER_ID;
client.color = client.config.EMBED_COLOR;
client.error = client.config.EMBED_ERROR;
client.logger = logger;
client.temp = {};
if (!client.token) client.token = client.config.TOKEN;
client.colors = colors;
client.shard_status = false
require("events").EventEmitter.defaultMaxListeners = 15;
client.startup = {
  "start": startTime,
  "end": 0
};


client.manager = new Kazagumo(
  {
    plugins: [
      new Spotify({
        clientId: client.config.spotify.ID,
        clientSecret: client.config.spotify.Secret,
        playlistPageLimit: 1, // optional ( 100 tracks per page )
        albumPageLimit: 1, // optional ( 50 tracks per page )
        searchLimit: 10, // optional ( track search limit. Max 50 )
        searchMarket: "JP", // optional ( search market. Default 'US' )
      }),
      new Nico({ searchLimit: 10 }),
      new deezer(),
      new Plugins.PlayerMoved(client),
    ],
    defaultSearchEngine: "spotify",
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  client.config.NODES,
  {
    moveOnDisconnect: false,
    resume: true,
    resumeKey: "MusicNode",
    resumable: false,
    resumeTimeout: 30,
    reconnectTries: 2,
    userAgent: "Elysia",
    restTimeout: 10000
  }
);
const loadCollection = [
  "slash", 
  "commands", 
  "premiums", 
  "interval", 
  "sent_queue", 
  "aliases",
  "pl_editing",
  "db_map"
]
loadCollection.forEach(x => client[x] = new Collection());


["aliases", "commands", "Slash"].forEach(
  (x) => (client[x] = new Collection())
);
[
  "antiCrash",
  "loadEvent",
  "loadDatabase",
  "loadNodeEvents",
  "loadCommand",
  "loadPlayer"
].forEach((x) => require(`./handlers/${x}`)(client));
logger.info("Booting client...")
client.cluster = new ClusterClient(client);


if (client.token) {
  client.login(client.token).catch((e) => {
    logger.error(
      "The Bot Token You Entered Into Your Project Is Incorrect Or Your Bot's INTENTS Are OFF!\n"
    );
  });
} else {
  logger.error(
    "Please Write Your Bot Token Opposite The Token In The config.js File In Your Project!"
  );
}
