import { AppDataSource } from "./db/data-source";
import app from "./app";

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to DB");
    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
