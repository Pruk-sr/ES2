

    const Josh = require('@joshdb/core');
    const JoshSQlite = require('@joshdb/sqlite');
    const Joshjson = require('@joshdb/json');
    const colors = require("colors");
    const logger = require('../plugins/logger')
    
    module.exports = async (client) => {
        client.YTP_DB = new Josh({
            name: 'YTP_DB',
            provider: Joshjson,
        });
        client.RdP_DB = new Josh({
            name: 'RdP_DB',
            provider: Joshjson,
        });
        client.hoyolabhi3 = new Josh({
          name: 'hoyolabhi3',
          provider: Joshjson,
        });
        client.hoyolabGi = new Josh({
          name: 'hoyolabGi',
          provider: Joshjson,
        });
        client.hoyolabhsr = new Josh({
          name: 'hoyolabhsr',
          provider: Joshjson,
        });
        client.blednayaleaks_hsr = new Josh({
          name: 'blednayaleaks_hsr',
          provider: Joshjson,
        });
        client.blednayaleaks = new Josh({
          name: 'blednayaleaks',
          provider: Joshjson,
        });
    
    
    
    
        client.blednayaleaks.defer.then(async () => {
          return client;
        });
        
        client.Hi3leaks = new Josh({
          name: 'Hi3leaks',
          provider: Joshjson,
        });
    
        client.Hi3leaks.defer.then(async () => {
          return client;
        });
        client.blednayaleaks_hsr.defer.then(async () => {
          return client;
        });
        client.hoyolabhi3.defer.then(async () => {
          return client;
        });
        client.hoyolabGi.defer.then(async () => {
          return client;
        });
        client.hoyolabhsr.defer.then(async () => {
          return client;
        });
        client.YTP_DB.defer.then(async () => {
            return client;
        });
        client.RdP_DB.defer.then(async () => {
           return client;
        });


        require(`./driver/connection`)(client)
        logger.info(`[DB] Databases loaded!`.brightGreen);
    }