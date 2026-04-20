#!/usr/bin/env bash
# Orquestador del pipeline clinical-landing-writer
# Uso: ./run.sh <testId> [--phase=research|draft|review]
set -euo pipefail

TEST_ID="${1:?testId required (e.g. gad7)}"
PHASE="${2:---all}"

REPO_ROOT=$(git rev-parse --show-toplevel)
SKILL_DIR="$REPO_ROOT/skills/clinical-landing-writer"
TEST_DIR="$REPO_ROOT/public/data/tests/$TEST_ID"

if [ ! -f "$TEST_DIR/metadata.json" ]; then
  echo "❌ metadata.json no encontrado en $TEST_DIR"
  exit 1
fi

echo "━━━ clinical-landing-writer ━━━"
echo "Test: $TEST_ID"
echo "Phase: $PHASE"
echo "Repo: $REPO_ROOT"
echo ""

case "$PHASE" in
  --phase=research|--all)
    echo "▶ Fase 1: Research clínica..."
    echo "  Prompt: $SKILL_DIR/phases/01-research.md"
    echo "  Output: $TEST_DIR/.dossier.json"
    echo "  (Este script prepara el entorno; la ejecución LLM"
    echo "   la dispara Emmanuel desde Claude Code cargando el"
    echo "   prompt junto al metadata + authors.)"
    ;;
esac

case "$PHASE" in
  --phase=draft|--all)
    echo "▶ Fase 2: Redacción..."
    echo "  Prompt: $SKILL_DIR/phases/02-draft.md"
    echo "  Input:  $TEST_DIR/.dossier.json + metadata + authors + templates"
    echo "  Output: $TEST_DIR/es.content.json (draft)"
    ;;
esac

case "$PHASE" in
  --phase=review|--all)
    echo "▶ Fase 3: Auto-revisión..."
    echo "  Prompt: $SKILL_DIR/phases/03-clinical-review.md"
    echo "  Input:  $TEST_DIR/es.content.json (preliminar)"
    echo "  Output: $TEST_DIR/es.content.json (final con flags)"
    echo "          $TEST_DIR/es.content.review.md"
    ;;
esac

echo ""
echo "Pipeline descrito. Las fases LLM las ejecuta Emmanuel desde"
echo "Claude Code cargando cada prompt con los inputs correctos."
echo ""
echo "Tras revisión humana: edita $TEST_DIR/es.content.json para"
echo "firmar clínicamente (status + clinicallyApprovedBy +"
echo "clinicallyApprovedAt) y haz commit."
