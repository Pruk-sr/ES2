require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "",
    PREFIX: process.env.PREFIX || "e!",
    OWNER_ID: process.env.OWNER_ID || "549131026262130688",
    DEV_ID: process.env.DEV_ID || " ",

    EMBED_COLOR: process.env.EMBED_COLOR || "#EED9FC",
    EMBED_ERROR: process.env.EMBED_ERROR || "#FF0000",

    SEARCH_DEFAULT: ["yoasobi", "zutomayo", "kotoha", "lisa"],
    SEARCH_ENGINE: process.env.SEARCH_ENGINE || "youtube", // default -- 'youtube' | 'soundcloud' | 'youtube_music'

    LEAVE_EMPTY: process.env.LEAVE_EMPTY || "120000",

    NP_REALTIME: process.env.NP_REALTIME || "true",
    AUTO_DEPLOY: process.env.AUTO_DEPLOY || "true",


    hookerror: process.env.HOOKERROR || "",

    NODES: [
        {
            name: process.env.NODES_NAME || 'For Elysia',
            url: process.env.NODES_URL || '78.108.218.114:25203',
            auth: process.env.EMBED_AUTH || '',
            secure: false
        }
    ],

    spotify: {
        ID: "fe1a4ba55d5f49ec92fc70c572d4fe4b", // spotify client id
        Secret: "1bf4b4af54cd4dc1bc7dbc676a840a0b", // spotify client secret
    },
}