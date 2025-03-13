"use client"

import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-600 dark:text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sin conexión a Internet</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            No te preocupes, puedes seguir usando la aplicación con funcionalidad limitada.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">¿Qué puedes hacer mientras estás offline?</h3>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>Ver contenido previamente cargado</li>
              <li>Crear nuevos elementos (se sincronizarán cuando vuelvas online)</li>
              <li>Editar elementos existentes</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            <button className="w-full">
              <Link href="/">Ir a la página principal</Link>
            </button>
            <button className="w-full" onClick={() => window.location.reload()}>
              Intentar reconectar
            </button>
          </div>
        </div>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          Los cambios que realices mientras estás offline se sincronizarán automáticamente cuando recuperes la conexión.
        </div>
      </div>
    </div>
  )
}