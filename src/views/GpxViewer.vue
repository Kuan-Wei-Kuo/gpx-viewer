<script setup lang="ts">
import { ref } from 'vue'

import OsmGpxViewer from '@/components/OsmGpxViewer.vue'

import useGeoJSON from '@/composables/use-geojson'

const selectedFile = ref<File | null>(null)
const geojson = ref<GeoJSON.FeatureCollection | null>(null)
const showPoints = ref(false)

const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (!file) return

  selectedFile.value = file

  const text = await file.text()

  geojson.value = useGeoJSON().gpx(text)
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-4">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-blue-800">🌍 GPX Viewer Demo</h1>
    <!-- 控制面板 -->
    <div class="bg-white shadow rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-4">
        <label
          for="gpx-upload"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          📤 上傳 GPX 檔案
        </label>
        <input
          id="gpx-upload"
          type="file"
          accept=".gpx"
          class="hidden"
          @change="handleFileChange"
        />
        <span class="text-gray-700 text-sm">{{ selectedFile?.name }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <input id="show-points" type="checkbox" class="form-checkbox" v-model="showPoints" />
        <label for="show-points" class="text-sm text-gray-700">顯示軌跡點</label>
      </div>
    </div>
    <!-- 地圖區域 -->
    <div
      class="h-[520px] bg-white shadow rounded-lg p-4 overflow-hidden shadow-lg border border-gray-200"
    >
      <OsmGpxViewer :geojson="geojson" :show-points="showPoints" />
    </div>
  </div>
</template>
