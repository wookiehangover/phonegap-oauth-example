install:
	test -d plugins || mkdir plugins
	npm install -g cordova
	npm install

.PHONY: install
