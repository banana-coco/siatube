<template>
  <div class="home-container">
    <div class="downloader-box">
      <h1>動画ダウンローダー</h1>
      <div class="input-group">
        <input 
          v-model="videoUrl" 
          type="text" 
          placeholder="YouTubeのURLを入力 (例: https://www.youtube.com/watch?v=...) " 
          @keyup.enter="handleGo"
        />
        <button @click="handleGo" :disabled="!isValidUrl">決定</button>
      </div>
      <div v-if="extractedVideoId" class="result-section">
        <div class="player-preview">
          <StreamPlayer :videoId="extractedVideoId" :streamType="'1'" />
        </div>
        <div class="download-section">
          <StreamType3 :videoId="extractedVideoId" />
        </div>
      </div>
    </div>

    <!-- カテゴリ切り替えボタン (元の機能も維持) -->
    <nav class="category-nav">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="{ active: selectedCategory === cat.key }"
        @click="selectedCategory = cat.key"
      >
        {{ cat.label }}
      </button>
    </nav>

    <main>
      <div v-if="loading" class="loading">読み込み中...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <VideoList
        v-if="!loading && !error && selectedVideos.length"
        :videos="selectedVideos"
        :title="currentCategoryLabel"
      />
    </main>
    <footer class="footer">
      <p style="margin-block-start: 1px; color: var(--text-primary);">しあtube</p>
      <p style="color: var(--text-primary);">
        <a href="https://github.com/siawaseoktest/youtube" target="_blank" rel="noopener noreferrer">GitHub</a> |
        <a href="https://www.google.com/url?q=https%3A%2F%2Fline.me%2Fti%2Fg2%2FvCj1dWEoRZTALbC0n1w53si3-KJ8OTXnfjV6aw%3Futm_source%3Dinvitation%26utm_medium%3Dlink_copy%26utm_campaign%3Ddefault&sa=D&sntz=1&usg=AOvVaw0AaRwnxB0yifPSGZ1TbcS5" target="_blank" rel="noopener noreferrer">LINE</a>
      </p>
      <div class="Accesscount">
        表示回数
        <img src="https://count.getloli.com/@:siatube?name=%3Asiatube&theme=minecraft&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto" style="width: 50%; max-width: 380px;">
      </div>
      <div style="color: var(--text-secondary);">バージョン1.5.2</div>
    </footer>
  </div>
</template>

<script>
import VideoList from "@/components/VideoList.vue";
import StreamPlayer from "@/components/StreamPlayer.vue";
import StreamType3 from "@/components/StreamType3.vue";

export default {
  components: { VideoList, StreamPlayer, StreamType3 },
  data() {
    return {
      videoUrl: "",
      extractedVideoId: "",
      trend: {
        trending: [],
        music: [],
        gaming: [],
      },
      loading: false,
      error: null,
      selectedCategory: "trending",
      categories: [
        { key: "trending", label: "急上昇" },
        { key: "gaming", label: "ゲーム" },
        { key: "music", label: "音楽" },
      ],
    };
  },
  computed: {
    isValidUrl() {
      return this.videoUrl.includes("v=") || this.videoUrl.includes("youtu.be/");
    },
    selectedVideos() {
      return this.trend[this.selectedCategory] || [];
    },
    currentCategoryLabel() {
      const found = this.categories.find(
        (c) => c.key === this.selectedCategory
      );
      return found ? found.label : "";
    },
  },
  created() {
    document.title = "しあチューブ - 動画ダウンローダー";
    this.fetchTrendData();
  },
  methods: {
    handleGo() {
      let id = "";
      if (this.videoUrl.includes("v=")) {
        id = this.videoUrl.split("v=")[1].split("&")[0];
      } else if (this.videoUrl.includes("youtu.be/")) {
        id = this.videoUrl.split("youtu.be/")[1].split("?")[0];
      }
      if (id) {
        this.extractedVideoId = id;
      }
    },
    async fetchTrendData() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("https://raw.githubusercontent.com/ajgpw/youtubedata/refs/heads/main/trend-base64.json", {redirect: "follow",});
        if (!res.ok) throw new Error("データ取得失敗");
        const data = await res.json();
        this.trend = data;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}
.downloader-box {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  margin: 1rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.downloader-box h1 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}
.input-group {
  display: flex;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto 2rem;
}
.input-group input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}
.input-group button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: var(--accent-color);
  color: var(--on-accent);
  font-weight: bold;
  cursor: pointer;
}
.input-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.result-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.player-preview {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}
.download-section {
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
}

.Accesscount {
  font-size: 1rem;
  color: var(--text-primary);
}
.category-nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}
.category-nav button {
  padding: 0.5rem 1rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.category-nav button:hover {
  background-color: var(--hover-bg);
}
.category-nav button.active {
  background-color: var(--accent-color);
  color: var(--on-accent);
}
.error {
  color: var(--accent-weak);
  padding: 1rem;
}
.loading {
  padding: 1rem;
  text-align: center;
  color: var(--text-primary);
}
main {
  padding: 1rem;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}
.footer {
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.footer a {
  color: var(--accent-color);
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.2s ease;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
