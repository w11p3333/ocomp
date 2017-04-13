mkdir middle
babel ./src/ -d ./middle
yarn build
rm -rf ./middle/
npm publish .