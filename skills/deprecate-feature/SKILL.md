# Skill: /deprecate-feature

## Propósito
Eliminar o archivar ordenadamente una feature del proyecto sin romper 
builds ni dejar código huérfano. Usado en consolidación hacia 
psicoprotego.es/tests.

## Proceso
1. Identificar TODOS los archivos de la feature (componentes, rutas 
   API, estilos, imports en otros archivos, dependencias npm, env vars, 
   entradas en tests-index, referencias en CLAUDE.md).
2. Clasificar cada archivo como ELIMINAR (código muerto sin valor 
   futuro) o ARCHIVAR (mover a archive/ dentro del repo, recuperable).
3. Eliminar/mover archivos.
4. Limpiar imports y referencias en archivos que permanecen.
5. Verificar con npm run build que el proyecto sigue compilando.
6. Commit con mensaje "refactor: deprecate <feature> (<eliminado|archivado>)"
   + cuerpo explicando qué se hizo y por qué.

## Criterios ELIMINAR vs ARCHIVAR
- ELIMINAR: ads (no se retomarán), URL shortener, Upstash/Redis 
  (feature descartada estratégicamente).
- ARCHIVAR: código que puede retomarse (idiomas no-ES, tests 
  no-validados, blog) → mover a archive/<subcarpeta>/ dentro del repo 
  con un README.md explicando qué es y por qué se archivó.

## Verificación final
- npm run build pasa.
- git status limpio tras commit.
- No quedan imports rotos (npm run typecheck si existe, si no tsc --noEmit).
