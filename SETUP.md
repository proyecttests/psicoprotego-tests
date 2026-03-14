# Psicoprotego Tests - Setup Rápido

## Reanudar desarrollo
```bash
cd /mnt/c/Users/EmmanuelRodríguezdeV/Documents/psicoprotego-tests
git pull origin main
npm install
npm run dev
```

Abre: http://localhost:5173

## Estructura clave
```
src/
├── components/
│   ├── common/        (Header, Footer, Disclaimer)
│   ├── test-framework/ (TestContainer, LikertScale, etc.)
│   └── results/       (ResultCard)
├── pages/             (TestPage, ResultPage)
├── utils/
│   ├── scoringFunctions.ts (scoreGAD7, factory)
│   └── analytics.ts         (trackEvent, trackPageView)
├── hooks/             (custom hooks)
├── config/            (analytics config)
└── data/
    └── tests.json     (preguntas GAD-7)
    └── messages.json  (mensajes resultado)

public/data/
├── tests.json         (estructura dinámicas)
├── messages.json      (mensajes por categoría)
└── logo-horizontal-verde.svg
```

## Comandos útiles
```bash
npm run dev      # Desarrollo local
npm run build    # Build producción
npm run preview  # Previsualizar build
git log --oneline  # Ver commits
```

## IDs importantes (NO COMMITEAR)

- GTM ID: GTM-MN3QW7Q7 (en index.html)
- GA4 ID: G-6H96S2FN53 (en GTM, no en código)
- GSC: Verificado por DNS (NRvYZWwus9jHi00itJsGNQvnu_ZjMMPZ66uNEmUQw9M)

## Agregar un nuevo test

1. Agregar definición en `public/data/tests.json`
2. Agregar mensajes en `public/data/messages.json`
3. Crear función `scorePHQ9()` en `src/utils/scoringFunctions.ts`
4. Registrar en `SCORING_REGISTRY`
5. Actualizar rutas en React Router

## Analytics

- GTM Dashboard: https://tagmanager.google.com/ (GTM-MN3QW7Q7)
- GA4: Automático dentro de GTM
- Custom events: usar `trackEvent()` desde `src/config/analytics.ts`

## Deploy

Auto-deploy al hacer `git push origin main`:
- GitHub → detecta push
- Vercel → buildea automáticamente
- Live en: https://psicoprotego-tests.vercel.app

Aprox 2-3 minutos por deploy.
