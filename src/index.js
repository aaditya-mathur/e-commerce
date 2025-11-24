import { dbConnection } from "./db/connection.js";
import app from "./server.js"

const PORT = process.env.PORT || 8000;

dbConnection().then(() => {
    app.listen(PORT,() => {
        console.log(`server is running on port : ${PORT}`)
    })
});