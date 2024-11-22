TIMESTAMP := $(shell date +%s)
run:
	@echo "Running Docker Compose with TIMESTAMP=$(TIMESTAMP)"
	TIMESTAMP=$(TIMESTAMP) docker-compose up -d
	
	
