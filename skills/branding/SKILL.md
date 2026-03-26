# Skill: Branding (cambio de identidad visual)

Proceso para actualizar la paleta de colores, fuentes e identidad visual de Psicoprotego.

## Fuente de verdad

Todo el branding centralizado en:
```
src/config/brand.ts
```

Cambiar ahí primero. Los demás archivos consumen estas constantes.

## Variables CSS / Tailwind

Los colores primarios se aplican vía CSS custom properties en:
- `app/globals.css` — definición de `--color-primary`, `--color-accent`, etc.
- `tailwind.config.js` — `colors.primary`, `colors.accent` apuntan a las CSS vars

Para cambiar el color primario:
1. Actualizar `BRAND_COLORS.primary` en `brand.ts`
2. Actualizar `--color-primary` en `globals.css`
3. Si el color Tailwind es un valor fijo (no var), también actualizarlo en `tailwind.config.js`

## Fuentes

Fuentes web cargadas en `app/[lang]/layout.tsx` vía `next/font` o Google Fonts.
Actualizar también `BRAND_FONTS` en `brand.ts` para que el PDF use las mismas.

> Nota: react-pdf no puede usar fuentes web dinámicas — requiere registrar con `Font.register()`.
> Ver `src/components/pdf/TestReportDocument.tsx` para el registro de fuentes PDF.

## Logos e imágenes

- Logo SVG: `public/logo.svg`
- Favicon: `public/favicon.ico`, `public/favicon.svg`
- OG image por defecto: `public/og-default.png` (1200×630)

## Checklist de cambio de branding

```
[ ] 1. Actualizar BRAND_COLORS en src/config/brand.ts
[ ] 2. Actualizar --color-primary (y accent) en app/globals.css
[ ] 3. Si hay cambio de fuente: actualizar layout.tsx + brand.ts + registrar en PDFs
[ ] 4. Reemplazar public/logo.svg
[ ] 5. Reemplazar public/favicon.ico y favicon.svg
[ ] 6. Reemplazar public/og-default.png (1200×630)
[ ] 7. Revisar DownloadCard.tsx — usa colores hardcoded para el canvas de stories
[ ] 8. npm run build — verificar que no hay errores TypeScript
[ ] 9. Revisar visualmente: /es, /es/test/apego, /es/test/apego/resultado
[ ] 10. git commit -m "brand: nueva identidad visual"
```

## Componentes que usan color primario directamente

Buscar con:
```bash
grep -r "color-primary\|#2d4a3e\|primary-" src/ --include="*.tsx" -l
```

Los componentes principales:
- `ResultCard.tsx` — barra de progreso, badges
- `DownloadCard.tsx` — story canvas (colores hardcoded en JS)
- `CookieBanner.tsx` — fondo del banner
- PDFs — `TestReportDocument.tsx`, `TestBlankDocument.tsx`

## Paleta actual

```
primary:   #2d4a3e  (verde oscuro)
accent:    #c8a96e  (dorado)
light:     #e8f4f0  (verde muy claro)
text:      #1a2e26  (verde muy oscuro / casi negro)
```
