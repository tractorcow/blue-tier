include .env
export

default: help
nvm:
	. ${NVM_DIR}/nvm.sh && nvm use && $(CMD)
install: ## Install dependencies
	make nvm CMD="npm install"
update: ## Update dependencies
	make nvm CMD="npm upgrade"
watch: ## Start dev watcher
	make nvm CMD="npm run dev"
lint: ## Lint all
	make nvm CMD="npm run lint"
fix: ## Lint and fix safe
	make nvm CMD="npm run fix"
migrate: ## Run prisma migrations
	make nvm CMD="npx prisma migrate dev"
	make nvm CMD="npx prisma generate"
build: ## Build a production build
	make nvm CMD="npm run build"
help: ## Display a list of commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sed 's/makefile://g' | awk 'BEGIN {FS = ":[^:]*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
