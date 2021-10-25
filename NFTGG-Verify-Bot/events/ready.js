// ** IMPORTS ** //

import messageCreate from "./messageCreate";

// ** Main Code ** //

export default {
    name: "",
    execute: async (client) => {
        console.log(`[Client] Logged in as ${client.user.tag}`);
        const guild = await client.guilds.fetch(`871878694963146763`);
        if(!client.db || !client.db.get('vc') || !client.db.get('vc.channels') || !client.db.get('vc.members')) {
            const category = await guild.channels.fetch("897631250918019103");
            client.db.set('vc.channels', []);
            client.db.set('vc.members', {});

            category.children.forEach(child => {
                if(child.type != 'GUILD_VOICE') return;
                if(!client.db.get(`vc.channels`).includes(child.id)) client.db.push(`vc.channels`, child.id)
            })

            const members = await guild.members.fetch();
            members.forEach(member => {
                if(member.user.bot) return;
                if(!client.db.get(`vc.members.${member.user.id}`)) {
                    client.db.get(`vc.channels`).forEach(cid => {
                        if(!client.db.get(`vc.members.${member.user.id}.${cid}`)) client.db.set(`vc.members.${member.user.id}.${cid}`, 0)
                    })
                }
            })
        }

        setInterval(async () => {
            guild.members.cache.forEach(m => {

                let key = m.user.id;

                const member = guild.members.cache.find(m => m.user.id === key);

                if(!member.voice.channel) return;

                const channels = client.db.get(`vc.channels`);

                if(!channels.includes(member.voice.channelId)) return;

                return client.db.set(`vc.members.${member.user.id}.${member.voice.channel.id}`, client.db.get(`vc.members.${member.user.id}.${member.voice.channelId}`) + 0.01)

            })
        }, 60000)

    }
}