<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';

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

// Update inputUrl when the text field changes
const updateUrl = (e: Event) => {
  const target = e.target as HTMLInputElement;
  inputUrl.value = target.value;
}

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
      <h1 class="title">ScrapFlow</h1>
      <div class="url-input">
        <md-outlined-text-field
          :value="inputUrl"
          @input="updateUrl"
          @keyup.enter="startScraping"
          label="Target URL"
          type="url"
          class="url-field"
        ></md-outlined-text-field>
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
  background-color: #f0f4f8; /* Light surface color */
  color: #1e1e1e;
  font-family: 'Roboto', sans-serif;
}

.top-bar {
  padding: 0.5rem 1rem;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1e1e1e;
  margin: 0;
}

.url-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.url-field {
  min-width: 300px;
}

.viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 24px;
  background-color: #f0f4f8;
}

.phone-frame {
  width: 375px;
  height: 812px;
  border: 12px solid #1f1f1f;
  border-radius: 48px;
  background: white;
  overflow: hidden;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Notch simulation */
.phone-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 24px;
  background: #1f1f1f;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  z-index: 20;
}

.proxy-frame {
  width: 100%;
  height: 100%;
  border: none;
  flex: 1;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #757575;
  font-size: 0.9rem;
}

.bottom-bar {
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  min-height: 80px;
}

.path {
  font-family: monospace;
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  word-break: break-all;
}
</style>
