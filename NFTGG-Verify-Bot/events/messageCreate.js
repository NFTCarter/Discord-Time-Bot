// ** IMPORTS ** //

import { MessageEmbed } from "discord.js";
import { readFile, writeFile } from "fs/promises";

// ** Main Code ** //

const usersMap = new Map()

export default {
    name: "",
    execute: async (message, client) => {

    if(message.author.bot) return;
    let embed;

    log(message, `${process.cwd()}/log.txt`)


    async function log(message, path) {
        if(!message.content || !message || !path || !message.channel) return false;
        const cleaned = message.content.replace(/[^\x00-\x7F]/g, "");
        let data = await readFile(path, 'utf8').catch(() => {});
        if(!data) data = ``;
        await writeFile(path, `${data.toString()}\n${message.author.tag}: ${cleaned}`, (err) => {
            if (err) throw err;
            return `Added "${message.author.tag}: ${cleaned}" to the log file."`
        });
    };

    // ** Command Handling ** //

    const prefix = client.config.prefix; // Imports prefix

    if(!message.content.startsWith(prefix)) return; // Prevents replying to bots and replying to non commands

    const args = message.content.slice(prefix.length).split(/ /gi); // Removes the prefix from the message and spilts the message at the spaces
    let command = args[0].toLowerCase(); // Gets the command as the first argument
    args.shift(); // Removes the command from the args array

    command = client.commands.find(c => c.name.toLowerCase() === command || c.aliases?.includes(command)); // Attempts to find the command

    if(!command) return; // No command? Return

    embed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle('You can\'t use that!')
    .setDescription("Sorry! That's a guild only command.")
    .setFooter(client.user.tag, client.user.avatarURL())
    .setTimestamp();

    if(command.guildOnly && !message.guild && client.config.permissionVerbose) return message.reply({embeds: [embed]}); // If this command is guild only and being used elsewhere, return

    embed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle('You can\'t use that!')
    .setFooter(client.user.tag, client.user.avatarURL())
    .setTimestamp();

    let temp;
    if(command.permissions || command.permissions?.length) { // If this command has a permission requirement
        command.permissions.every(perm => { // Loop over the command permissions
            if(!message.member.permissions.has(perm) && message.author.id != client.config.ownerID && client.config.permissionVerbose) { 
                temp = true;
                embed.setDescription(`Sorry! You need the \`${perm}\` permission for this command.`) // If the author does not have the permissions, return
                message.reply({embeds: [embed]});
                return true;
            }
        })
        if(temp) {
            temp = undefined;
            return;
        }
    }

    embed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle('You can\'t use that!')
    .setDescription("Sorry! You need to be the server owner to use this command.")
    .setFooter(client.user.tag, client.user.avatarURL())
    .setTimestamp();

    if(command.ownerOnly && message.author.id != message.guild.ownerId && message.author.id != client.config.ownerID && client.config.permissionVerbose) return message.reply({embeds: [embed]}); // If this command is guild owner only and being used by others, return

    embed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle('You can\'t use that!')
    .setDescription("Sorry! You need to be the bot owner to use this command.")
    .setFooter(client.user.tag, client.user.avatarURL())
    .setTimestamp();

    if(command.botOwnerOnly && message.author.id != client.config.ownerID && client.config.permissionVerbose) return message.reply({embeds: [embed]}); // If this command is bot owner only and being used by others, return

    command.execute(message, args, client) // Run command

    }
}