#!/usr/bin/env bash
# release.sh — bump ДС-версию, коммит и пуш
# Использование: npm run release [VERSION]
# Пример: npm run release 1.6.0
# Без аргумента — только коммит и пуш без смены версии

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DS_MD="$ROOT/design/design-system.md"
CLAUDE_MD="$ROOT/CLAUDE.md"
TODAY="$(date +%Y-%m-%d)"
NEW_VERSION="${1:-}"

# ── 1. Опционально: обновить версию ────────────────────────────────────────
if [[ -n "$NEW_VERSION" ]]; then
  echo "→ Устанавливаем версию $NEW_VERSION"

  # design-system.md: строка «> **Version:** X.Y.Z · ...»
  sed -i '' "s/\*\*Version:\*\* [0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*/\*\*Version:\*\* $NEW_VERSION/" "$DS_MD"
  # Обновляем дату в той же строке
  sed -i '' "s/\*\*Updated:\*\* [0-9-]*/\*\*Updated:\*\* $TODAY/" "$DS_MD"

  # CLAUDE.md: строка «**Last updated:** ... | **Version:** X.Y»
  sed -i '' "s/\*\*Last updated:\*\* [0-9-]*/\*\*Last updated:\*\* $TODAY/" "$CLAUDE_MD"
  sed -i '' "s/\*\*Version:\*\* [0-9][0-9]*\.[0-9][0-9]*/\*\*Version:\*\* $NEW_VERSION/" "$CLAUDE_MD"

  echo "   design-system.md → v$NEW_VERSION"
  echo "   CLAUDE.md        → v$NEW_VERSION"
fi

# ── 2. Собрать саммари изменений ───────────────────────────────────────────
DIFF_STAT=$(git -C "$ROOT" diff --stat HEAD)

echo ""
echo "── Изменённые файлы ─────────────────────────────────────────────────"
echo "$DIFF_STAT"

# ── 3. Сформировать сообщение коммита ─────────────────────────────────────
if [[ -n "$NEW_VERSION" ]]; then
  COMMIT_MSG="feat: ДС v$NEW_VERSION — Loos Condensed, Badge, Input xs, иконки 2px"
else
  # Автогенерация сообщения из списка файлов
  CHANGED=$(git -C "$ROOT" diff --name-only HEAD | sed 's|.*/||' | paste -sd ', ')
  COMMIT_MSG="chore: обновить $CHANGED"
fi

echo ""
echo "── Сообщение коммита ────────────────────────────────────────────────"
echo "   $COMMIT_MSG"
echo ""

# ── 4. Стейджинг + коммит ─────────────────────────────────────────────────
cd "$ROOT"
git add -A
git commit -m "$COMMIT_MSG"

# ── 5. Пуш ────────────────────────────────────────────────────────────────
git push
echo ""
echo "✓ Готово. Версия $NEW_VERSION запушена на origin/main."
