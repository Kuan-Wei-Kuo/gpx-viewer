import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gpx-viewer',
      component: () => import('@/views/GpxViewer.vue'),
    },
  ],
})

export default router
