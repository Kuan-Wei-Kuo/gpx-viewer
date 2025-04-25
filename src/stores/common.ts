import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: () => ({
    currentPosition: {
      lat: 22.6208,
      lng: 120.3119,
    },
  }),
  actions: {
    findCurrentPosition() {
      const promise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            this.currentPosition = {
              lat: latitude,
              lng: longitude,
            }

            console.log(`使用者位置：緯度 ${latitude}, 經度 ${longitude}`)

            resolve(true)
          },
          (error) => {
            console.error('取得位置失敗：', error.message)
            reject(false)
          },
        )
      })

      return promise
    },
  },
})
