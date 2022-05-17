const { MessageEmbed } = require('discord.js');

const exampleEmbed = new MessageEmbed()
  .setColor('#FF7F50')
  .setTitle('Welcome traveler!\nHave a drink with me!')
  .setAuthor({
    name: 'MateBot',
    iconURL: 'https://i.imgur.com/m96gO6X.png',
    url: 'https://i.imgur.com/m96gO6X.png',
  })
  .setDescription('Read this carefully!')
  .setThumbnail('https://i.imgur.com/m96gO6X.png')
  .addFields(
    {
      name: 'Rules',
      value:
        'In order to get access on the server you must accept the following terms and conditions:',
    },
    { name: '\u200B', value: '\u200B' },
    {
      name: 'Do not spam!',
      value:
        'Please be aware that any message that doesn t fit or is not suitable for a specific channel will be removed and the author will be warned',
      inline: true,
    },
    {
      name: 'Do not share!',
      value:
        'Please be aware that we don t ask you anything to provide, so neither should you do on the channels',
      inline: true,
    }
  )
  .addField(
    'Do not scam!',
    'Please be aware that any attempt of trying to scam is highly discourage and forbidden to any channel',
    true
  )
  .setTimestamp()
  .setFooter({
    text: '© Copyright 2022 MateBot',
    iconURL: 'https://i.imgur.com/m96gO6X.png',
  });

const addReactions = (message, reactions) => {
  message.react(reactions[0]);
  reactions.shift();
  if (reactions.lenght > 0) {
    addTimeout(() => addReactions(message, reactions), 750);
  }
};

module.exports = async (client, id, text, reactions = []) => {
  const channel = await client.channels.fetch(id);

  channel.messages.fetch().then((messages) => {
    if (messages.size === 0) {
      //sending the message
      channel.send({ embeds: [exampleEmbed] });
      channel.send(text).then((message) => {
        addReactions(message, reactions);
      });
    } else {
      //editing/updating the message
      for (const message of messages) {
        message[1].edit(text);
        addReactions(message[1], reactions);
      }
    }
  });
};
