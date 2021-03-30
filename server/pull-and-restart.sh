
cd ~/imitate/server
git pull
yarn
yarn build
pm2 restart ecosystem.config.js