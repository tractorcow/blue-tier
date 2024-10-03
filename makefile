include .env
export

# Function to load nvm and set the node version
define NVM_SETUP
	. $(NVM_DIR)/nvm.sh && nvm use $(NODE_VERSION)
endef

default: help
install: ## Install dependencies
	@$(NVM_SETUP) && npm install
update: ## Update dependencies
	@$(NVM_SETUP) && npm update
watch: ## Start dev watcher
	@$(NVM_SETUP) && npm run dev
lint: ## Lint all
	@$(NVM_SETUP) && npm run lint
fix: ## Lint and fix safe
	@$(NVM_SETUP) && npm run fix
migrate: ## Run prisma migrations
	@$(NVM_SETUP) && npx prisma migrate dev && npx prisma generate
build: ## Build a production build
	@$(NVM_SETUP) && npm run build
help: ## Display a list of commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sed 's/makefile://g' | awk 'BEGIN {FS = ":[^:]*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
