const useGeoJSON = () => {
  const gpx = (gpx: string): GeoJSON.FeatureCollection => {
    const parser = new DOMParser()
    const xml = parser.parseFromString(gpx, 'application/xml')

    const trkpts = xml.querySelectorAll('trkpt')

    const coordinates: [number, number, number][] = []
    const pointFeatures: GeoJSON.Feature[] = []

    trkpts.forEach((trkpt, i) => {
      const lat = parseFloat(trkpt.getAttribute('lat') || '0')
      const lon = parseFloat(trkpt.getAttribute('lon') || '0')
      const ele = parseFloat(trkpt.querySelector('ele')?.textContent || '0')
      const time = trkpt.querySelector('time')?.textContent || ''

      coordinates.push([lon, lat, ele])

      pointFeatures.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          index: i,
          ele,
          time,
          markerType: i === 0 ? 'start' : i === trkpts.length - 1 ? 'end' : 'track',
        },
      })
    })

    const collection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates },
          properties: {
            name: xml.querySelector('trk > name')?.textContent || 'GPX Track',
          },
        },
        ...pointFeatures,
      ],
    }

    return collection
  }

  return { gpx }
}

export default useGeoJSON
