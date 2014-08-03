watch:
	grunt workon
install:
	npm install -g yo grunt grunt-cli bower
	#npm install generator-node-express grunt-mocha-cli expect.js geojson-utils superagent js-yaml
	npm install .
test:
	grunt test
all: watch
