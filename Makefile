# Makefile — convenience wrapper for the AsciiDoc + Antora Reference.
#
# Zero-install: every target shells out to `npx`, so `make build` works without
# a prior `npm install`. Targets mirror the package.json scripts so the two
# interfaces never drift.
#
#   make          list targets (default)
#   make build    render the site into public/
#   make serve    build, then serve it over HTTP
#   make watch    rebuild on save + live-reload the browser
#   make clean    remove generated output

PLAYBOOK := antora-playbook.yml
OUTPUT   := public

.DEFAULT_GOAL := help
.PHONY: help build serve watch clean install

help: ## List available targets
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: make <target>\n\n"} \
		/^[a-zA-Z0-9_-]+:.*##/ {printf "  \033[36m%-9s\033[0m %s\n", $$1, $$2} \
		END {print ""}' $(MAKEFILE_LIST)

build: ## Render the site into public/ (fetches the UI bundle on first run)
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

clean: ## Remove the generated public/ directory
	rm -rf $(OUTPUT)

install: ## Install pinned Antora + http-server locally (optional; npx needs nothing)
	npm install
