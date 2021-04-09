
cd ~/napchart-website/server
echo waiting 5 seconds...
sleep 5
git pull
yarn
yarn build
pm2 restart ecosystem.config.js