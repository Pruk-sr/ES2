const database = require("./index")

module.exports = async (client) => {
    try {
        const db_config = "./data/elysia.database.json"
        await database.JSONDriver(client, db_config)
        return
    } catch (error) {
        return client.logger.log(error);
    }
} 