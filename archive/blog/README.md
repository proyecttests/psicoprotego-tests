# Archive: Blog

## Qué se archivó
- `app_lang_blog/` — Rutas Next.js del blog (`/[lang]/blog` y `/[lang]/blog/[slug]`)
- `src_utils/blog.ts` — Utilidad para leer posts de Markdown desde `content/blog/`
- `src_components_blog/` — Componente `BlogTracker` (analytics de posts)

## Por qué se archivó
Fecha: 2026-04-18. Decisión de consolidación: el contenido editorial se mueve
al WordPress de psicoprotego.es. La suite de tests se centra exclusivamente en
herramientas psicométricas validadas, sin sección de blog propia.

## Cómo restaurarlo
1. Mover `app_lang_blog/` de vuelta a `app/[lang]/blog/`
2. Mover `src_utils/blog.ts` a `src/utils/blog.ts`
3. Mover `src_components_blog/` a `src/components/blog/`
4. Restaurar el import `getAllBlogPosts` en `app/[lang]/page.tsx`
5. Restaurar el enlace "Blog" en `src/components/common/Footer.tsx`
6. Crear directorio `content/blog/` con los posts en Markdown
