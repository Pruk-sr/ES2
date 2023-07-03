const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../settings/config.js");
module.exports = {
    name: ["restart"],
    description: "restart Bot",
    category: "Misc",
    options: [
        {
            name: "password",
            type: ApplicationCommandOptionType.String,
            description: "รหัสผ่านสำหรับยืนยันการรีบูตบอท",
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const inputPassword = interaction.options.getString("password") ?? "";

        if (interaction.user.id !== client.ownerID) return await interaction.reply("🛑 อย่านะ..ไม่เอาๆ ฟังก์ชันนี้ต้องใช้สิทธิ์ระดับบนเท่านั้นนะ");
        if (!interaction.client.temp.password) {
			const owner = await interaction.client.users.fetch(client.ownerID);
			const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let password = "";

			interaction.client.temp.password = 0;

			for (let i = 0; i <= 12; i++) {
				let randomNumber = Math.floor(Math.random() * chars.length);
				password += chars.substring(randomNumber, randomNumber + 1);
			}

			interaction.client.temp.password = password;

			owner.send(`**:arrows_counterclockwise: มีคำขอสำหรับการรีสตาร์ทระบบใหม่ค่าา!!**\nเพื่อยืนยันว่าเป็นท่านกรุณากรอกรหัสผ่านนี้ในเซิร์ฟเวอร์ที่ท่านเรียกใช้คำสั่ง\nท่านสามารถละเว้นได้หากไม่ต้องการดำเนินการต่อ\nขอขอบคุณที่ท่านยังดูแลฉันมาจนถึงทุกวันนี้นะคะ :)\n||${password}||`);
		}
        if (inputPassword !== interaction.client.temp.password) return await interaction.reply("❎ รหัสผ่านไม่ถูกต้องนะคะ ลองตรวจสอบใหม่อีกครั้งคะ");
        await interaction.reply("🔄 กำลังเริ่มระบบใหม่...");
		await interaction.client.destroy();
		await interaction.client.login(config.TOKEN);
		await interaction.editReply("✅ เริ่มระบบใหม่แล้วคะ!!");
    }
};
