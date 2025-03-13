"use client"

import { useEffect, useState } from "react"

export function ServiceWorkerFallback() {
  const [isServiceWorkerSupported, setIsServiceWorkerSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    // Verificar si el navegador soporta Service Workers
    const isSupported = "serviceWorker" in navigator
    setIsServiceWorkerSupported(isSupported)

    if (isSupported) {
      // Intentar registrar el service worker
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
      // Verificar si ya hay un service worker registrado
      const registrations = await navigator.serviceWorker.getRegistrations()
      if (registrations.length > 0) {
        console.log("Service Worker ya registrado:", registrations[0])
        setIsRegistered(true)
        return
      }

      // Intentar registrar el service worker con Workbox
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      console.log("Service Worker registrado con éxito:", registration)
      setIsRegistered(true)

      console.log("a ver como sale esto ", isServiceWorkerSupported, isRegistered)

      // Registrar para sincronización en segundo plano si está disponible
      /* if ("sync" in registration as any) {
        try {
          await registration?.sync?.register("sync-data")
          console.log("Sincronización en segundo plano registrada")
        } catch (syncError) {
          console.warn("Error al registrar sincronización en segundo plano:", syncError)
        }
      } else {
        console.warn("SyncManager no está soportado en este navegador")
      } */
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error)

      // Implementar fallback para entornos de vista previa
      implementFallback()
    }
  }

  function implementFallback() {
    console.log("Implementando fallback para Service Worker en entorno de vista previa")

    // Simular caché básica para APIs externas
    if ("caches" in window) {
      caches.open("external-api-cache").then((cache) => {
        // Cachear la API externa cuando se acceda a ella
        const apiUrl = "https://webapi.aclimate.org/api/"

        fetch(apiUrl, { mode: "cors", credentials: "omit" })
          .then((response) => {
            if (response.ok) {
              cache.put(apiUrl, response.clone())
              console.log("API externa cacheada manualmente")
            }
          })
          .catch((err) => console.warn("Error cacheando API:", err))
      })
    }
  }

  // Este componente no renderiza nada visible
  return null
}
