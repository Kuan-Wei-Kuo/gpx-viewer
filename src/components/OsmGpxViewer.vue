<script setup lang="ts">
import { onMounted, watch } from 'vue'
import L from 'leaflet'

import { useCommonStore } from '@/stores/common'

let map: L.Map | null = null
let trackLayer: L.GeoJSON | null = null
let trackMarkerLayer: L.LayerGroup<L.CircleMarker> | null = null

const props = defineProps<{
  geojson: GeoJSON.FeatureCollection | null
  showPoints: boolean
}>()

watch(
  () => [props.geojson],
  () => {
    showGeoJson(true)
  },
)

watch(
  () => [props.showPoints],
  () => {
    showGeoJson(false)
  },
)

const showGeoJson = (fitBounds = false) => {
  if (!map || !props.geojson) return

  if (trackLayer) {
    map.removeLayer(trackLayer)
  }

  if (trackMarkerLayer) {
    map.removeLayer(trackMarkerLayer)
  }

  trackLayer = L.geoJSON(props.geojson, {
    filter: (f) => f.geometry.type === 'LineString',
    pointToLayer: function (feature, latlng) {
      const [lon, lat] = feature.geometry.coordinates
      const time = feature.properties.time || 'N/A'
      const ele = feature.properties.ele || 'N/A'

      const content = `
        <div class="text-sm">
          <div><strong>座標：</strong>${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
          <div><strong>時間：</strong>${new Date(time).toLocaleString()}</div>
          <div><strong>高度：</strong>${parseFloat(ele).toFixed(1)} m</div>
        </div>
      `

      return L.circleMarker(latlng, {
        radius: 6,
        color: 'red', // 邊框紅色
        weight: 1, // 邊框寬度
        fill: true,
        fillColor: '#f87171', // Tailwind red-400，填滿紅色
        fillOpacity: 0.7,
      }).bindPopup(content)
    },
  }).addTo(map)

  if (props.showPoints) {
    const pointFeatures = props.geojson.features.filter((f) => f.geometry.type === 'Point')

    const markers = pointFeatures.map((f) => {
      const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates || [0, 0]
      const ele = f.properties?.ele || 'N/A'
      const time = f.properties?.time || 'N/A'

      const content = `
      <div class="text-sm">
        <div><strong>座標：</strong>${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
        <div><strong>時間：</strong>${new Date(time).toLocaleString()}</div>
        <div><strong>高度：</strong>${parseFloat(ele).toFixed(1)} m</div>
      </div>
    `

      return L.circleMarker([lat, lon], {
        radius: 6,
        color: 'red',
        weight: 1,
        fillColor: '#f87171',
        fillOpacity: 0.7,
      }).bindPopup(content)
    })

    trackMarkerLayer = L.layerGroup(markers).addTo(map)
  }

  if (fitBounds) {
    map.fitBounds(trackLayer.getBounds())
  }
}

onMounted(async () => {
  // create map
  map = L.map('map').setView([37.7749, -122.4194], 13)
  // add tile layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  // find current position
  await useCommonStore().findCurrentPosition()
  // set view to current position
  map.setView([useCommonStore().currentPosition.lat, useCommonStore().currentPosition.lng], 15)
})
</script>

<template>
  <div id="map" class="w-full h-full"></div>
</template>
