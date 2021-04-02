#!/usr/bin/env bash

# install new dependencies if any
npm install

# uninstall the current bcrypt modules (OS issues)
npm uninstall bcrypt

# install the bcrypt modules for the machine
npm install bcrypt

# Execute Sequelize Migrations, Seeds 
npm install --save-dev sequelize-cli
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed:undo:all
npx sequelize db:seed:all

echo "Starting API server"

npm run dev