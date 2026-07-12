#!/usr/bin/env bash
#
# export.sh — convert a BUILT Antora page (from public/) to DOCX or EPUB.
#
# PDF is produced natively by the Antora build (@antora/pdf-extension ->
# asciidoctor-pdf), published under public/reference/_exports/. DOCX and EPUB
# have no native AsciiDoc converter, so we run pandoc over the already-rendered
# HTML — every Antora macro (include::partial$, xref:comp::, page-*) is resolved
# there, which plain Asciidoctor converters can't do.
#
# Usage:   scripts/export.sh <docx|epub|all> [page-under-public]
# Example: scripts/export.sh docx reference/blocks/index.html
#          scripts/export.sh all               # defaults to the start page
#
set -euo pipefail

fmt="${1:-all}"
page="${2:-reference/index.html}"
out_dir="export"
src="public/${page}"

[[ -f "$src" ]] || { printf 'error: %s not found — run "make build" first\n' "$src" >&2; exit 1; }
mkdir -p "$out_dir"

# Flat, meaningful name: reference/blocks/index.html -> reference-blocks
name="$(printf '%s' "$page" | sed -e 's|/index\.html$||' -e 's|\.html$||' -e 's|/|-|g')"
[[ -n "$name" ]] || name="page"
srcdir="$(dirname "$src")"

need_pandoc() {
  command -v pandoc >/dev/null 2>&1 ||
    { printf 'error: pandoc not found — install it (Arch: sudo pacman -S pandoc)\n' >&2; exit 1; }
}

do_docx() {
  need_pandoc
  printf '→ DOCX  %s/%s.docx\n' "$out_dir" "$name"
  pandoc "$src" --resource-path="$srcdir" --extract-media="$out_dir/media" \
    --metadata title="AsciiDoc + Antora Reference" -o "$out_dir/$name.docx"
}

do_epub() {
  need_pandoc
  printf '→ EPUB  %s/%s.epub\n' "$out_dir" "$name"
  pandoc "$src" --resource-path="$srcdir" --extract-media="$out_dir/media" \
    --metadata title="AsciiDoc + Antora Reference" -o "$out_dir/$name.epub"
}

case "$fmt" in
  docx) do_docx ;;
  epub) do_epub ;;
  all) do_docx; do_epub ;;
  *) printf 'usage: %s <docx|epub|all> [page-under-public]  (PDF is built natively by Antora)\n' "$0" >&2; exit 2 ;;
esac

printf 'done → %s/\n' "$out_dir"
