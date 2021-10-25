// ** IMPORTS ** //

import { MessageEmbed, VoiceChannel } from 'discord.js';

// ** Main Code ** //

export default {
    name: "",
    description: "Resets the time counter for specific channels, users, or both",
    usage: "<user || channel> {channel}",
    aliases: ["rs"],
    permissions: ['ADMINISTRATOR'],
    guildOnly: true,
    ownerOnly: false,
    botOwnerOnly: false,
    execute: async (message, args, client) => {

        let embed;
        let mems = await message.guild.members.fetch();
        const user = message.mentions.users.first() || await mems.find(m => m.id === args[0] || m.user.username.toLowerCase() === args.join(" ").toLowerCase() || m.user.tag.toLowerCase() === args.join(" ").toLowerCase() || m.nickname?.toLowerCase() === args.join(" ").toLowerCase())?.user;
        if(user) args.shift();
        let taggedChannel = message.mentions.channels.first() || await message.guild.channels.cache.find(m => m.id === args[0] || m.name.toLowerCase() === args.join(" ").toLowerCase());
        let memberData = client.db.get("vc.members");
        const channelData = client.db.get("vc.channels");

        embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle(`You can't do that!`)
        .setDescription(`You need to tag a user or a channel. Or both!`)
        .setFooter(client.user.tag, client.user.avatarURL())
        .setTimestamp();

        if(!user && !taggedChannel) return message.reply({embeds: [embed]});

        if(user && !taggedChannel) {
            Object.keys(memberData[user.id]).forEach(k => client.db.set(`vc.members.${user.id}.${k}`, 0))
            embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle(`Reset Success!`)
            .setDescription(`${user.username} now has 0 hours for all voice channels!`)
            .setFooter(client.user.tag, client.user.avatarURL())
            .setTimestamp();
    
             return message.reply({embeds: [embed]});
        };

        if(taggedChannel && !user) {
            embed = new MessageEmbed()
            .setColor("ORANGE")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle(`You can't do that!`)
            .setDescription(`That isn't a valid channel`)
            .setFooter(client.user.tag, client.user.avatarURL())
            .setTimestamp();

            if(!channelData.includes(taggedChannel.id)) return message.reply({embeds: [embed]});

            Object.keys(memberData).forEach(k => client.db.set(`vc.members.${k}.${taggedChannel.id}`, 0))

            embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle(`Reset Success!`)
            .setDescription(`All users now has 0 hours for ${taggedChannel.name}!`)
            .setFooter(client.user.tag, client.user.avatarURL())
            .setTimestamp();
    
             return message.reply({embeds: [embed]});
        }

        if(user && taggedChannel) {
            client.db.set(`vc.members.${user.id}.${taggedChannel.id}`, 0)
            embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setTitle(`Reset Success!`)
            .setDescription(`${user.username} now has 0 hours for ${taggedChannel.name}!`)
            .setFooter(client.user.tag, client.user.avatarURL())
            .setTimestamp();
    
             return message.reply({embeds: [embed]});   
        }

    }
}