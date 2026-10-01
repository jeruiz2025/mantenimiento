# README

Sistema de Mantenimiento de Equipos y Hojas de Vida.

## Configuración

1. Crear una base de datos en Supabase (PostgreSQL).
2. Copiar `DATABASE_URL` en `.env`.
3. `npm run db:push` para crear las tablas.
4. `npm run dev` para desarrollo.

## Estructura

- Planos: imagen del plano de ubicación con botones por ubicación.
- Ubicaciones: puntos sobre el plano (coordenadas en %).
- Equipos: ficha del equipo (serial, tipo, marca, modelo, estado).
- Mantenimientos: historial de la hoja de vida del equipo.