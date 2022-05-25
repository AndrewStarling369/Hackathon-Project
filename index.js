const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const extractConfig = require('./config.json');

//---
const automaticMessage = require('./automatic-message');
const { config, off } = require('node:process');
//---

//---
const channel = '974229677436719135'; //verification channel
const memberRole = '973533624815198318'; //verified
const verifyEmoji = '✅';
//---

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
require('dotenv').config();

client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

//---
client.once('ready', () => {
  console.log('Ready!');

  const { prefix } = extractConfig;
  client.user.setActivity({
    name: `"${prefix}help" for more info`,
    type: 'LISTENING',
  });

  //---
  automaticMessage(
    client,
    '974229677436719135',
    'Take the beer as a welcome gift and proceed further by using the /verify command to continue!',
    ['🍺']
  );
  //---
});
//---

client.on('message', (msg) => {
  if (msg.author.bot) return;
  // if (!msg.guild) return;
  if (msg.content.length >= 300) {
    msg.delete();
    msg.channel.send(
      'you are not allowed to spam this channel'
      // `${msg.author}, you are not allowed to spam this channel!`
    );
  }
  if (
    msg.channel.id === '974229677436719135' &&
    (msg.content !== '/verify' ||
      msg.content !== '/authorize' ||
      msg.content !== '/help')
  ) {
    return msg.delete();
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

//---
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

//---
client.on('messageReactionAdd', async (reaction, user) => {
  if (!('partial' in reaction)) {
    return;
  }

  if (reaction.message?.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message?.guild) return;

  //if reaction is added to the channel
  if (reaction.message.channel.id == channel) {
    if (reaction.emoji.name === verifyEmoji) {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(memberRole)
        .then(setTimeout(() => reaction.message.delete(), 10000));
    }
  } else {
    return;
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (!('partial' in reaction)) {
    return;
  }
  if (reaction.message?.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message?.guild) return;

  if (reaction.message.channel.id == channel) {
    if (reaction.emoji.name === verifyEmoji) {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(memberRole)
        .then(setTimeout(() => reaction.message.delete(), 10000));
    }
  } else {
    return;
  }
});
//---

client.login(token);
