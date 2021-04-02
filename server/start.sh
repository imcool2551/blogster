#!/usr/bin/env bash

# install new dependencies if any
npm install

# uninstall the current bcrypt modules (OS issues)
npm uninstall bcrypt

# install the bcrypt modules for the machine
npm install bcrypt

# Execute Sequelize Migrations 
npm install --save-dev sequelize-cli
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate

echo "Starting API server"

npm run dev