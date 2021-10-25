// ** IMPORTS ** //

import { MessageEmbed } from 'discord.js';
import otcsv from '../../Util/csv';

// ** Main Code ** //

export default {
    name: "",
    description: "Exports time data to a file and sends it to you!",
    usage: "",
    aliases: [],
    permissions: [`ADMINISTRATOR`],
    guildOnly: true,
    ownerOnly: false,
    botOwnerOnly: false,
    execute: async (message, args, client) => {

        let data = await otcsv(client.db.get(`vc.members`), `${process.cwd()}/MemberTimeData.txt`);
        message.author.send({
            content: `Here's your exported data! It was saved in my files too.`,
            files: [data]
        })
        .then(m => message.reply(`Data exported! I sent you a dm with the contents!`))
        .catch(e => message.reply(`I couldn't dm you the file contents! I've exported it to my directory anyways`))

    }
}