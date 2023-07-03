const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["ping"],
    description: "ตรวจสอบความหน่วงและ API Latency ของเซิร์ฟเวอร์",
    category: "Misc",
    run: async (client, interaction) => {
        const message = await interaction.reply({ "content": "🏓 ปิง...", "fetchReply": true });
        const roundtrip = message.createdTimestamp - interaction.createdTimestamp;
        const websocket = interaction.client.ws.ping;

          const pingEmbed = new EmbedBuilder()
              .setTitle(`**📡 การเชื่อมต่อ**` + client.user.username)
              .setDescription(`เวลาแฝงไปกลับ คือ ${websocket} มิลลิวินาที\nอัตราการทำงานของเว็บซ็อกเก็ต คือ ${roundtrip} มิลลิวินาที`)
              .setTimestamp()
              .setColor(client.color);
              await interaction.editReply({
                "content": "🏓 ปอง",
                "embeds": [pingEmbed]
            });  
    }
};