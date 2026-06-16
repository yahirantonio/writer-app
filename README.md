# Writer App

Una aplicación web moderna para escritores que combina un editor de texto enriquecido con herramientas de organización y contexto para escritores.

## Características

- **Editor de Texto Enriquecido** — Edición con formato usando Tiptap, con barra de herramientas para estilos básicos
- **Gestor de Archivos** — Panel lateral para navegar y organizar archivos en árbol
- **Panel de Contexto** — Herramientas para notas rápidas y gestión de personajes
- **Almacenamiento de Estado** — Persiste automáticamente el contenido usando Zustand
- **Interfaz Moderna** — Diseño limpio y responsive con Tailwind CSS

## Tecnologías

- **Framework**: Next.js 16.2.9
- **UI**: React 19.2.4 con TypeScript
- **Editor**: Tiptap 3.26.1
- **Estado**: Zustand 5.0.14
- **Estilos**: Tailwind CSS 4
- **Herramientas**: ESLint, TypeScript

## Instalación

```bash
# Instalar dependencias
npm install
```

## Scripts

```bash
# Desarrollo (servidor en http://localhost:3000)
npm run dev

# Compilación para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página de inicio
├── components/
│   ├── Editor/           # Editor y barra de herramientas
│   ├── Sidebar/          # Navegación de archivos
│   ├── ContextPanel/     # Panel de notas y personajes
│   ├── Layout/           # Layout general (AppShell)
│   └── UI/               # Componentes reutilizables (Modal, etc.)
└── stores/
    └── useWriterStore.ts # Estado global con Zustand
```

## Componentes Principales

### WriterEditor
Editor de texto rico con barra de herramientas, sincronización de contenido y estado vacío informativo.

### Sidebar
Gestor de archivos con estructura de árbol para navegación y selección de documentos.

### ContextPanel
Panel para acceder rápidamente a notas y información de personajes mientras se escribe.

### AppShell
Componente contenedor que integra todas las secciones principales de la aplicación.

## Desarrollo

La aplicación usa componentes Cliente (`'use client'`) de Next.js. El estado global se gestiona con Zustand para sincronizar contenido entre componentes sin prop drilling.

El editor está configurado con Tiptap StarterKit (párrafos, encabezados, listas, énfasis) y un placeholder personalizado.

## Licencia

Privado
