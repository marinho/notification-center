install-dev:
	npm install -g yo grunt grunt-cli bower generator-node-express
install:
	npm install
test:
	grunt test
all: basic-dev install test
run:
	grunt workon
