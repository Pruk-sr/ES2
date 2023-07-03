const { Chatbot } = require('edgegptjs');

module.exports = async function Chat(message) {
    try {
        if (!message) return;
        const args = {cookiePath: "./data/cookies.json"};
        const bot = new Chatbot(args.cookiePath);
        await bot.chatHubInitialization;
        const response = await bot.ask(message);
        return response;
        } catch (error) {
            return false;
        }
}






























