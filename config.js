require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "MTA2MjgyMDY2MTUxMDI3NTEzMg.G_iMds.BJGbqsECLPLLaJEGkujmTU-Py14Oi3d-kT1rII",
    OWNER_ID: process.env.OWNER_ID || "549131026262130688",
    EMBED_COLOR: process.env.EMBED_COLOR || "#EED9FC",
    SEARCH_DEFAULT: ["yoasobi", "zutomayo", "kotoha", "lisa"],
    SEARCH_ENGINE: process.env.SEARCH_ENGINE || "youtube", // default -- 'youtube' | 'soundcloud' | 'youtube_music'
    LEAVE_EMPTY: process.env.LEAVE_EMPTY || "120000",

    NP_REALTIME: process.env.NP_REALTIME || "true",
    AUTO_DEPLOY: process.env.AUTO_DEPLOY || "true",

    hookerror: process.env.HOOKERROR || "https://discord.com/api/webhooks/1056482582293909525/jjY3Ld1vXwjGJH3ojepbxUe-Dv5HUkM2BFVH-c5TlmJw4A8fIDPLEIvR5KqfCGSJMSLU",

    NODES: [
        {
            name: process.env.NODES_NAME || 'For Elysia',
            url: process.env.NODES_URL || '78.108.218.114:25203',
            auth: process.env.EMBED_AUTH || 'mysparkedserver',
            secure: false
        }
    ],

    spotify: {
        ID: "fe1a4ba55d5f49ec92fc70c572d4fe4b", // spotify client id
        Secret: "1bf4b4af54cd4dc1bc7dbc676a840a0b", // spotify client secret
    },
}