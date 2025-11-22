<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
// Import Material Web components (we will verify these are installed and imported correctly in main.ts if needed)
// But usually they are custom elements.

const iframeSrc = ref('');
const inputUrl = ref('https://example.com');
const selectedElement = ref<any>(null);

const startScraping = () => {
  if (inputUrl.value) {
    // Point to the local proxy server
    iframeSrc.value = `http://localhost:3000/proxy?url=${encodeURIComponent(inputUrl.value)}`;
  }
};

const handleMessage = (event: MessageEvent) => {
  // Verify origin if possible, but for local dev we accept *
  const data = event.data;
  if (data && data.type === 'ELEMENT_SELECTED') {
    selectedElement.value = data.payload;
    console.log('Element selected:', data.payload);
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<template>
  <div class="app-container">
    <!-- Top Bar -->
    <header class="top-bar">
      <h1>ScrapFlow</h1>
      <div class="url-input">
        <input v-model="inputUrl" type="text" placeholder="https://example.com" @keyup.enter="startScraping" />
        <md-filled-button @click="startScraping">Go</md-filled-button>
      </div>
    </header>

    <!-- Main Viewport -->
    <main class="viewport">
      <div class="phone-frame">
        <iframe
          v-if="iframeSrc"
          :src="iframeSrc"
          class="proxy-frame"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
        <div v-else class="placeholder">
           <p>Enter a URL to start scraping</p>
        </div>
      </div>
    </main>

    <!-- Bottom Bar (Controls) -->
    <footer class="bottom-bar">
      <div v-if="selectedElement">
        <p><strong>Selected:</strong> {{ selectedElement.tagName }}</p>
        <p class="path">{{ selectedElement.path }}</p>
      </div>
      <div v-else>
        <p>Select an element on the screen</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
  color: #1e1e1e;
}

.top-bar {
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.url-input {
  display: flex;
  gap: 10px;
}

.viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
}

.phone-frame {
  width: 375px;
  height: 812px;
  border: 16px solid #333;
  border-radius: 36px;
  background: white;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  position: relative;
}

.proxy-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.bottom-bar {
  padding: 1rem;
  background: white;
  border-top: 1px solid #ddd;
}
</style>
