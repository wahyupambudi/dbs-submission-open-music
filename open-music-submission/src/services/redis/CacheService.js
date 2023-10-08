const redis = require("redis");
const { config } = require("../../commons/config");

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: config.redis.url,
    });

    this._client.on("error", (error) => {
      console.error(error);
    });

    /**
     * @TODO-8: Panggil method `connect` dari `this._client` untuk menghubungkan ke server Redis.
     * Referensi: https://www.dicoding.com/academies/271/tutorials/17819
     */
    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (!result) {
      throw new Error("Cache tidak ditemukan");
    }

    return result;
  }

  async delete(key) {
    // TODO-9: Panggil method `del` dari `this._client` untuk menghapus key dari cache.
    // Referensi: https://www.dicoding.com/academies/271/tutorials/17819
    this._client.del(key);
  }
}

module.exports = CacheService;
