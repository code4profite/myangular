#!/bin/bash
nvm use 18
sleep 1
xunit-viewer -r TESTS-Firefox_108.0_\(Windows_10\).xml -o firefox-junit.html
xunit-viewer -r TESTS-Chrome_108.0.0.0_\(Windows_10\).xml -o chrome-junit.html
nvm use 10