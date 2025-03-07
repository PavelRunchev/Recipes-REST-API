module.exports = {
    development: {
        port: process.env.PORT || 3000,
        // MongoDB Atlas
        dbPath: 'mongodb+srv://abobo:nakururu@db.fcmym.mongodb.net/Recipes-DB?retryWrites=true&w=majority'
        // Local database 
        //dbPath: 'mongodb://localhost:27017/SharedTripp-db'
    },
    production: {
        port: process.env.PORT || 8000,
        // MongoDB Atlas
        dbPath: 'mongodb+srv://abobo:nakururu@db.fcmym.mongodb.net/Recipes-DB?retryWrites=true&w=majority'
     }
};