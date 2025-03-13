const { generateSW } = require("workbox-build")
const path = require("path")

generateSW({
  globDirectory: "public",
  globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,ico,json}"],
  swDest: path.join("public", "sw.js"),
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Cachear páginas HTML (navegación)
      urlPattern: /\/$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "pages-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
      },
    },
    {
      // Cachear API externa específica
      urlPattern: /https:\/\/webapi\.aclimate\.org\/api/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "external-api-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Cachear recursos estáticos
      urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
      },
    },
    {
      // Cachear fuentes
      urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "fonts-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 días
        },
      },
    },
    {
      // Cachear tiles de mapas
      urlPattern: /.*\.openstreetmap\.org\/.*\.png$/,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-cache",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
})
  .then(({ count, size }) => {
    console.log(`Generado service worker con ${count} archivos precacheados, totalizando ${size} bytes.`)
  })
  .catch((err) => {
    console.error("Error al generar el service worker:", err)
  })

