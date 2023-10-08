// @TODO-1: import amqp dari module amqplib
const { config } = require('../../commons/config');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = // @TODO-2: buat koneksi ke rabbitmq. Referensi: https://www.dicoding.com/academies/271/tutorials/17629
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    // @TODO-3: kirim pesan ke queue. Referensi: https://www.dicoding.com/academies/271/tutorials/17629

    setTimeout(() => {
      // @TODO-4: tutup koneksi ke rabbitmq. Referensi: https://www.dicoding.com/academies/271/tutorials/17629

    }, 1000);
  },
};

module.exports = ProducerService;
