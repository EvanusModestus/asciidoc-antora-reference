# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [1.0.0] - 2026-07-12

First public release: a standalone Antora site demonstrating every AsciiDoc and
Antora feature as copyable source beside its live-rendered result, deployed to
GitHub Pages and mirrored to GitLab.

### Added

- Initial reference site covering the AsciiDoc + Antora feature set.
- GitHub Pages deployment via GitHub Actions on every push to `main`.
- Five switchable themes with a live picker.
- Client-side full-text search (Lunr).
- Always-on code toolbar with a language pill and copy button.
- Theme picker relocated to a bottom dock, plus a focus toggle.
- Multi-format export: native PDF book (`@antora/pdf-extension` + `asciidoctor-pdf`)
  and DOCX/EPUB via `pandoc`.

### Fixed

- Print stylesheet for clean PDF/print output.

[Unreleased]: https://github.com/EvanusModestus/asciidoc-antora-reference/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/EvanusModestus/asciidoc-antora-reference/releases/tag/v1.0.0
