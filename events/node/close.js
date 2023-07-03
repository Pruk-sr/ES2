module.exports = async (client, name, code, reason) => {
    if (client.count !== 0) {
        client.count + 1
        client.logger.error(`[LAVALINK] |${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`);
    }
    
}