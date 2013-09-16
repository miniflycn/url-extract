install:
	@npm install

test:
	@mocha

test-cov:
	@mocha --require blanket -R html-cov > coverage.html
	@echo Please open coverage.html to see the result!

test-coveralls:
	@mocha --require blanket --reporter mocha-lcov-reporter | COVERALLS_REPO_TOKEN="1YMpW0X8cMInhR9glhlTEM8lovs1bY9RV" ./node_modules/coveralls/bin/coveralls.js

.PHONY: test test-cov test-coveralls