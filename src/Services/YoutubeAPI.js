// AIzaSyAHRCjkwhFREdQppywi-x40q3xpcuy5dsc

// YoutubeAPI.js
export default class YoutubeAPI {
  constructor() {
    this.apiKey = "AIzaSyAHRCjkwhFREdQppywi-x40q3xpcuy5dsc";

    // IDs de canais específicos de drinks
    this.drinkChannels = [
        "UCR0NqQsKc9X8Atumrvst7Tw",
        "UCaDy5YPO5m2CY0Tz7TbwVhQ",
        "UCaDY8WjYWy36bnt0RVzSklw"
    ];

  }

  async searchVideoByDrinkName(drinkName) {
    const encoded = encodeURIComponent(drinkName);

    try {
      const results = [];

      // Busca em cada canal
      for (const channelId of this.drinkChannels) {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}
          &channelId=${channelId}
          &q=${encoded}
          &type=video
          &maxResults=1`
            .replace(/\s+/g, "")
        );

        const data = await res.json();

        if (data.items && data.items.length > 0) {
          results.push(data.items[0]);
        }
      }

      if (results.length === 0) return null;

      // Retorna o primeiro vídeo encontrado (simples)
      return `https://www.youtube.com/embed/${results[0].id.videoId}`;

    } catch (err) {
      console.error("Erro ao buscar vídeo no YouTube:", err);
      return null;
    }
  }
}
