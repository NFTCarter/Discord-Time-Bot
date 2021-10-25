// ** IMPORTS ** //

import { MessageEmbed } from 'discord.js';
import { sort } from 'semver';

// ** Main Code ** //

export default {
    name: "",
    description: "Shows the vc time leaderboards",
    usage: "{member || channel}",
    aliases: ["tb"],
    permissions: [],
    guildOnly: true,
    ownerOnly: false,
    botOwnerOnly: false,
    execute: async (message, args, client) => {

        let embed;
        let mems = await message.guild.members.fetch();
        const user = message.mentions.users.first() || await mems.find(m => m.id === args[0] || m.user.username.toLowerCase() === args.join(" ").toLowerCase() || m.user.tag.toLowerCase() === args.join(" ").toLowerCase() || m.nickname?.toLowerCase() === args.join(" ").toLowerCase())?.user;
        let taggedChannel = message.mentions.channels.first() || await message.guild.channels.cache.find(m => m.id === args[0] || m.name.toLowerCase() === args.join(" ").toLowerCase());
        let memberData = client.db.get("vc.members");
        let fixedMemberData = {};
        const channelData = client.db.get("vc.channels");
        let sorted;

            for(const key in memberData) {
                if(!fixedMemberData[key]) fixedMemberData[key] = {};
                Object.values(memberData[key]).map(data => fixedMemberData[key]?.total ? fixedMemberData[key].total = fixedMemberData[key].total + data : fixedMemberData[key].total = data ?? 0)
            }
            sorted = Object.entries(fixedMemberData).sort((a, b) => a[1].total - b[1].total).reverse();

        if(taggedChannel && !channelData.includes(taggedChannel.id)) taggedChannel = undefined;
        if(!user && !taggedChannel) {
        let i = 0;
        embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle('Total hours spent in vc')
        .setDescription(`\`\`\`${sorted.map(d => {
            if(i<10) {
            i++;
            let member = mems.find(m => m.user.id === d[0]);
            if(!member) i = i-1;
            if(member) return `${i}) ${member.user.username}: ${(d[1].total * 100 / 60).toFixed(2)} hours\n`}
        }).join('')}\`\`\``)
        .setFooter(client.user.tag, client.user.avatarURL())
        .setTimestamp();

        return message.reply({embeds: [embed]});
        }

        if(user) {

            function values() {
                let channels = Object.entries(memberData[user.id]).sort((a, b) => a[1] - b[1]).reverse();
                return channels.map(c => {
                    const channel = message.guild.channels.cache.find(ch => ch.id === c[0]);
                    return `${channel.name}: ${(c[1] * 100 / 60).toFixed(2)}`
                }).join('\n')
            }

        embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle(`Current hours for ${user.username}`)
        .setDescription(`Total Hours: \`${sorted.filter(d => d[0] === user.id).map(d => (d[1].total * 100 / 60).toFixed(2))}\``)
        .addField(`Individual Channels`, `\`\`\`${values()}\`\`\``)
        .setFooter(client.user.tag, client.user.avatarURL())
        .setTimestamp();

         return message.reply({embeds: [embed]});
        }

        if(taggedChannel) {
            let i =0;

        let correctVals;
        function moreValues(cid) {
            correctVals = {};
            for(const key1 in memberData) {
                for (const key2 in memberData[key1]) {
                    if(key2 === taggedChannel.id) correctVals[key1] = memberData[key1][key2]
                }
            }
        }

        moreValues()
        sorted = Object.entries(correctVals).sort((a, b) => a[1] - b[1]).reverse();

        embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle(`Hours spent in ${taggedChannel.name}`)
        .setDescription(`\`\`\`${sorted.map(d => {
            if(i<10) {
            i++;
            let member = mems.find(m => m.user.id === d[0]);
            if(!member) i = i-1;
            if(member) return `${i}) ${member.user.username}: ${(d[1] * 100 / 60).toFixed(2)} hours\n`}
        }).join('')}\`\`\``)
        .setFooter(client.user.tag, client.user.avatarURL())
        .setTimestamp();

        return message.reply({embeds: [embed]})
    }


    }
}