module.exports = {
    index: (req, res) => {
        res.status(200);
        res.send("Hello World Node JS");
    },

    proba: (req, res) => {
        res.status(200);
        res.send("Proba for Node JS");
    }
}