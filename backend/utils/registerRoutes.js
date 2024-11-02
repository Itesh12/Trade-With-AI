// registerRoutes.js
const fs = require('fs');
const path = require('path');

function registerRoutes(app, prefix) {
    const routesDir = path.join(__dirname, '../routes'); // Adjust this path if needed

    // Read all route files in the routes directory
    fs.readdirSync(routesDir).forEach((file) => {
        if (file.endsWith('.js')) {
            const route = require(path.join(routesDir, file));
            app.use(prefix, route);
            console.log(
                `Registered route: ${prefix}${file.replace('.js', '')}`
            );
        }
    });
}

module.exports = registerRoutes;
