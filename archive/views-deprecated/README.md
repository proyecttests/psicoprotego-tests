# Archive: vistas sin uso

## Qué se archivó
- `TestInterstitial.tsx` — pantalla «Antes de comenzar» con aviso y hueco de publicidad, de la época
  anterior a Next.js. Ningún código la importaba: la ruta `/:lang/test/:testId/start` la pinta
  `app/[lang]/test/[testId]/start/page.tsx`.

## Por qué se archivó
Fecha: 2026-11-04. Deuda detectada en la auditoría de seguridad: era una copia antigua de `/start`
que podía confundirse con la vigente.

## Cómo restaurarlo
No hay que restaurarlo. La pantalla vigente es `app/[lang]/test/[testId]/start/page.tsx`.
