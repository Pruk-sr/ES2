const { ClusterManager, HeartbeatManager, ReClusterManager, fetchRecommendedShards } = require('discord-hybrid-sharding');
const logger = require('./plugins/logger');
const { TOKEN } = require("./settings/config");
const { timeConsole } = require("./plugins/clientUtils");
const { resolve } = require("node:dns");

process.on('unhandledRejection', error => logger.log({ level: 'error', message: error }));
process.on('uncaughtException', error => logger.log({ level: 'error', message: error }));

logger.log("Initialize multi-process sharding...");
logger.log("Checking connection to server...");


// Check connection to serve
resolve("discord.com", (error) => {
    if (error) return logger.error("Unable to connect to Discord server");

    process.env.TERM = "xterm";
    process.env.CHECK_CONNECTION = true;

    logger.log("Creating shading manager...");

async function run() {
    const shardsPerClusters = 5;
    
    const manager = new ClusterManager(`${__dirname}/login.js`, {
        totalShards: 'auto', // you can set to every number you want but for save mode, use 'auto' option
        totalClusters: 'auto', // you can set to every number you want but for save mode, use 'auto' option
        shardsPerClusters: shardsPerClusters,
        mode: "worker", // you can also choose "worker"
        token: TOKEN,
        restarts: {
            max: 5, // Maximum amount of restarts per cluster
            interval: 60000 * 60, // Interval to reset restarts
        },
    });
    manager.extend(new ReClusterManager());
    logger.log("Create shardCreate event...");
    setInterval(reclusterShards, 24 * 60 * 60 * 1000);
    await manager.on('clusterCreate', cluster => logger.info(`Launched Cluster ${cluster.id} || ${cluster.totalShards}||${cluster.shardList}shards`));
    await manager.on('clusterDestroy', cluster => logger.info(`Destroyed Cluster ${cluster.id}`));
    await manager.extend(
        new HeartbeatManager({
            interval: 2000, // Interval to send a heartbeat
            maxMissedHeartbeats: 5, // Maximum amount of missed Heartbeats until Cluster will get respawned
        })
    )
    await manager.spawn();


    async function reclusterShards() {
        try {
            const recommendedShards = await fetchRecommendedShards(TOKEN);
            if (recommendedShards != manager.totalShards) {
                manager.recluster.start({
                    restartMode: 'gracefulSwitch',
                    totalShards: recommendedShards,
                    shardsPerClusters: shardsPerClusters,
                    shardList: null,
                    shardClusterList: null
                });
            }
        } catch (error) {
            logger.error('Error reclustering shards' + error);
        }
    }
}
run()
logger.log("Spawn shards...");
logger.log("Successful to create multi-process sharding.");
});