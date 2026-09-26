# .claude/rules/deploy.md

## Antes de desplegar

- **`npm run build` en local, sin errores**, antes de cualquier despliegue o merge que dispare uno.
  `prebuild` regenera el índice de tests (`scripts/generate-tests-index.js`); si falla ahí, el
  build entero falla.

## Vercel: Production Overrides

- Los **Production Overrides** del panel de Vercel (Settings → Build & Deployment) mandan sobre
  `vercel.json`. Si están **activos y vacíos** (build command en blanco), Vercel no ejecuta nada:
  el despliegue termina en ~100 ms y todo el sitio responde 404.
- Si un despliegue termina sospechosamente rápido o el sitio da 404 generalizado, comprobar los
  Production Overrides antes que nada — descartarlos o hacer que Emmanuel los revise en el panel.
