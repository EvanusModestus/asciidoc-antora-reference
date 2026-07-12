# Makefile — convenience wrapper for the AsciiDoc + Antora Reference.
#
# `make build` installs dependencies on first run (the Lunr search extension
# must be resolvable), then renders via `npx`. Targets mirror the package.json
# scripts so the two interfaces never drift.
#
#   make          list targets (default)
#   make build    render the site into public/
#   make serve    build, then serve it over HTTP
#   make watch    rebuild on save + live-reload the browser
#   make export   DOCX + EPUB of a page (PDF is built natively by the pdf extension)
#   make clean    remove generated output

PLAYBOOK := antora-playbook.yml
OUTPUT   := public
# Which built page to export. Override: make pdf PAGE=reference/blocks/index.html
PAGE     ?= reference/index.html

.DEFAULT_GOAL := help
.PHONY: help build serve watch docx epub export clean install

help: ## List available targets
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: make <target>\n\n"} \
		/^[a-zA-Z0-9_-]+:.*##/ {printf "  \033[36m%-9s\033[0m %s\n", $$1, $$2} \
		END {print ""}' $(MAKEFILE_LIST)

node_modules: package.json ## (internal) install deps when package.json changes
	npm install
	@touch node_modules

build: node_modules ## Render the site into public/ (installs deps + fetches the UI bundle on first run)
	npx antora --fetch $(PLAYBOOK)

serve: build ## Build, then serve public/ over HTTP and open a browser
	npx http-server $(OUTPUT) -c-1 -o

watch: build ## Rebuild on save + live-reload the browser (Ctrl-C to stop)
	@echo "▶  Watching docs/ + supplemental-ui/ — browser-sync opens the site and reloads on save"
	@trap 'kill 0' INT TERM EXIT; \
		npx -y onchange 'docs/**/*' 'supplemental-ui/**/*' '$(PLAYBOOK)' -- $(MAKE) build & \
		npx -y browser-sync start --server '$(OUTPUT)' --startPath reference/index.html \
			--files '$(OUTPUT)/_/css/*.css, $(OUTPUT)/**/*.html' --no-notify; \
		wait

docx: build ## Export a page to DOCX via pandoc (PAGE=reference/blocks/index.html)
	scripts/export.sh docx "$(PAGE)"

epub: build ## Export a page to EPUB via pandoc (needs pandoc)
	scripts/export.sh epub "$(PAGE)"

export: build ## Export a page to DOCX + EPUB into export/ (PDF is built natively)
	scripts/export.sh all "$(PAGE)"

clean: ## Remove generated output (public/ and export/)
	rm -rf $(OUTPUT) export

install: ## Install pinned Antora + http-server locally (optional; npx needs nothing)
	npm install
