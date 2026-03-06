import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(` ⚙️ Server is running on port http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error(` ❌ fail to connect: ${error.message}`);
        process.exit(1);
    });