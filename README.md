# Psicoprotego — GAD-7 MVP

Plataforma de evaluación psicológica basada en el cuestionario **GAD-7**
(Generalized Anxiety Disorder 7-item scale).

## Stack

| Tecnología | Versión |
|---|---|
| React | 18.x |
| Vite | 5.x |
| Tailwind CSS | 3.x |
| TypeScript | 5.x |
| React Router | 6.x |

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Build de producción
npm run build

# 4. Preview del build
npm run preview
```

## Estructura del proyecto

```
src/
├── components/
│   ├── common/          # Botones, inputs, cards reutilizables
│   ├── test-framework/  # Componentes del cuestionario GAD-7
│   └── results/         # Visualización de resultados
├── pages/               # Vistas principales (Home, Test, Results)
├── hooks/               # Custom React hooks
├── utils/               # Helpers y funciones puras
├── config/              # Constantes y configuración de app
└── styles/              # Estilos globales adicionales

public/
└── data/                # JSON estáticos (ej: preguntas GAD-7)
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

## Fases de desarrollo

- [x] **FASE 1** — Setup: React + Vite + Tailwind + TypeScript + Router
- [ ] **FASE 2** — Cuestionario GAD-7 interactivo
- [ ] **FASE 3** — Cálculo de puntuación e interpretación
- [ ] **FASE 4** — Exportación de resultados (PDF/CSV)
- [ ] **FASE 5** — Deploy en Vercel
