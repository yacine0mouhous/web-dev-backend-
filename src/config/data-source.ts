import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  port: 27017,
  database: "your_database_name",
  useUnifiedTopology: true,
  synchronize: true, 
  logging: true,
  entities: ["src/models/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
