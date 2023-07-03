module.exports = async (client) => {
    try {
      require("./Player/loadEvent.js")(client);
      require("./Player/loadContent.js")(client);
      require("./Player/loadSetup.js")(client);
      require("./Player/loadUpdate.js")(client);
        client.logger.info('Shoukaku Player Events Loaded!');
    } catch (e) {
      console.log(e);
    }
};
