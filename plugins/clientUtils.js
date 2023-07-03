const { format } = require("node:util");

/**
 * This helps in reducing the length of numbers from the thousands and above.
 * To make it easier to read and keep statistics.
 * 
 * @param {Number} number The number want to convert
 * @param {Number} digits The number of decimals to be stored.
 * @returns A string of converted numbers: e.g. **12.34k**
 * @example currencyFormatter(12345, 2); // => 12.34k
 */
const currencyFormatter = (number, digits) => {
    const lookup = [
        { "value": 1, "symbol": "" },
        { "value": 1e3, "symbol": "k" },
        { "value": 1e6, "symbol": "M" },
        { "value": 1e9, "symbol": "G" },
        { "value": 1e12, "symbol": "T" },
        { "value": 1e15, "symbol": "P" },
        { "value": 1e18, "symbol": "E" }
    ];
    const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find((item) => number >= item.value);

    return item ? (number / item.value).toFixed(digits).replace(regex, "$1") + item.symbol : "0";
}

/**
 * Convert text to ID
 * 
 * @param {String} text 
 */
const IDConvertor = (text) => {
    return text.toLowerCase().replace(/[^\w\s]/g, "-").replace(/ +/g, "-");
}
const BitwisePermissionFlags = {
    0x0000000000000001: "Create Invite",
    0x0000000000000002: "Kick Members",
    0x0000000000000004: "Ban Members",
    0x0000000000000008: "Administrator",
    0x0000000000000010: "Manage Channels",
    0x0000000000000020: "Manage Server",
    0x0000000000000040: "Add Reactions",
    0x0000000000000080: "View Audit Log",
    0x0000000000000100: "Priority Speaker",
    0x0000000000000200: "Video",
    0x0000000000000400: "Read Text Channels & See Voice Channels",
    0x0000000000000800: "Send Messages",
    0x0000000000001000: "Send TTS Messages",
    0x0000000000002000: "Manage Messages",
    0x0000000000004000: "Embed Links",
    0x0000000000008000: "Attach Files",
    0x0000000000010000: "Read Message History",
    0x0000000000020000: "Mention @everyone, @here, and All Roles",
    0x0000000000040000: "Use External Emojis",
    0x0000000000080000: "View Server Insights",
    0x0000000000100000: "Connect",
    0x0000000000200000: "Speak",
    0x0000000000400000: "Mute Members",
    0x0000000000800000: "Deafen Members",
    0x0000000001000000: "Move Members",
    0x0000000002000000: "Use Voice Activity",
    0x0000000004000000: "Change Nickname",
    0x0000000008000000: "Manage Nicknames",
    0x0000000010000000: "Manage Roles",
    0x0000000020000000: "Manage Webhooks",
    0x0000000040000000: "Manage Emojis & Stickers",
    0x0000000080000000: "Use Application Commands",
    0x0000000100000000: "Request to Speak",
    0x0000000200000000: "Manage Events",
    0x0000000400000000: "Manage Threads",
    0x0000000800000000: "Create Public Threads",
    0x0000001000000000: "Create Private Threads",
    0x0000002000000000: "Use External Stickers",
    0x0000004000000000: "Send Messages in Threads",
    0x0000008000000000: "Use Embedded Activities",
    0x0000010000000000: "Moderate Members",
    0x0000020000000000: "View Creator Monetization Analytics",
    0x0000040000000000: "Use Soundboard"
}
/**
 * Calculated as the current time and tailored to the console time.
 * 
 * @param {Date} date time of occurrence
 * @param {String} format Three options are supported: **full**, **date** and **time**.
 */
const timeConsole = (date, format = "full") => {
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (format === "full") return year + "-" + month + "-" + day + "." + hours + ":" + minutes + ":" + seconds;
    if (format === "date") return year + "-" + month + "-" + day;
    if (format === "time") return hours + ":" + minutes + ":" + seconds;
};

module.exports = {
    currencyFormatter,
    timeConsole,
    IDConvertor,
    BitwisePermissionFlags
};