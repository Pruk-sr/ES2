module.exports = async (client, name, error) => {
    if (client.count !== 0) {
        client.count + 1
        client.logger.error(`[LAVALINK] | "${name}" error ${error}`);
    }
}