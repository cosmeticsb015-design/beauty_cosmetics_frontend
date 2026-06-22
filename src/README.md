# Screaming Architecture

La carpeta `src/` agrupa el código por intención de negocio para que la arquitectura comunique las capacidades principales de la aplicación.

- `features/admin/`: experiencia administrativa, acciones de servidor, clientes y componentes internos del panel.
- `features/checkout/`: pasos y tipos propios del flujo de compra.
- `shared/components/`: componentes reutilizables de UI pública o transversal.
- `shared/context/`: proveedores y contexto compartido de la aplicación.
- `shared/lib/`: utilidades base e integración de bajo nivel.
- `shared/services/`: servicios de datos compartidos para Strapi, checkout, tienda y administración.

La carpeta `app/` conserva únicamente las rutas de Next.js App Router y activos requeridos por el framework; esas rutas importan las implementaciones desde `src/` para mantener el comportamiento existente.
