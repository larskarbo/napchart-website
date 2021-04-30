
cd ~/napchart-website/server
echo waiting 5 seconds...
sleep 5
git pull
yarn
pm2 restart ecosystem.config.js