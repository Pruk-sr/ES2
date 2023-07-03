const chillout = require("chillout");
const readdirRecursive = require("recursive-readdir");
const { resolve, relative } = require("path");

module.exports = async (client) => {
    let interactionsPath = resolve("./commands/slash");
    let interactionFiles = await readdirRecursive(interactionsPath);

    await chillout.forEach(interactionFiles, (interactionFile) => {
        const start = Date.now();
        const rltPath = relative(__dirname, interactionFile);
     //   console.log(`[INFO] Loading interaction at.. "${interactionFile}"`)
        const command = require(interactionFile);

        if (command.name.length > 3) {
            client.logger.warn(`"${rltPath}" The name list of the interaction file is too long. (>3) Skipping..`);
            return;
        }

        if (!command.name?.length) {
            client.logger.warn(`"${rltPath}" The interaction file does not have a name. Skipping..`);
            return;
        }

        if (client.Slash.has(command.name)) {
            client.logger.warn(`"${command.name[1]}" interaction has already been installed. It's skipping.`)
            return;
        }

        client.Slash.set(command.name, command);
     //   console.log(`[INFO] "${command.type == "CHAT_INPUT" ? `/${command.name.join(" ")}` : `${command.name[0]}`}" ${command.name[1] || ""}  ${command.name[2] || ""} The interaction has been uploaded. (it took ${Date.now() - start}ms)`);
        });
        if (client.Slash.size) {
            client.logger.info(`${client.Slash.size} Interactions Loaded!`);
        } else {
            client.logger.warn(`No interactions loaded, is everything ok?`);
        }
}