const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
});