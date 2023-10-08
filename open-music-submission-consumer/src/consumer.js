const amqp = require('amqplib');
const config = require("./config");
const MailService = require("./MailService");
const PlaylistsService = require("./PlaylistsService");

(async () => {
  const mailService = new MailService();
  const playlistsService = new PlaylistsService();

  const connection = await amqp.connect(config.rabbitmq.url);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true
  });

  channel.consume('export:playlists', async (message) => {
    const { playlistId, targetEmail } = JSON.parse(message.content.toString());

    try {
      const playlist = await playlistsService.getPlaylistById(playlistId);
      const songs = await playlistsService.getSongsByPlaylistId(playlistId);

      const payload = {
        playlist: {
          ...playlist,
          songs,
        }
      }

      await mailService.sendMail(targetEmail, JSON.stringify(payload));

      await channel.ack(message);
    } catch (error) {
      console.error(error);
      await channel.ack(message);
    }
  });
})()
