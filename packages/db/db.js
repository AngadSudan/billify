import mongoose from "mongoose";
const MAX_RETRY = 5;
const RETRY_INTERVAL = 5000;

class databaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isconnected = false;
    this.databaseUrl = "";

    // mongoose.set("strictQuery", !0);

    mongoose?.connection?.on("connected", () => {
      console.log("MONGODB Connected Successfully !");
      this.isconnected = true;
    });
    mongoose?.connection?.on("error", (err) => {
      console.log("MONGODB Connection Error: ", err);
      this.isconnected = false;
    });
    mongoose?.connection?.on("disconnected", async () => {
      console.log("MONGODB Disconnected !");
      this.isconnected = false;
      await this.handleConnectionError();
    });

    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }
  async connectDB(MONGO_URI) {
    try {
      if (!MONGO_URI) {
        throw new Error("MONGO_URL not found in .env file");
      }
      this.databaseUrl = MONGO_URI;
      console.log("Connecting to MongoDB...");

      if (process.env.NODE_ENV === "development") {
        mongoose?.set("debug", true);
      }

      await mongoose?.connect(MONGO_URI);
      this.retryCount = 0;
    } catch (error) {
      console.error("error in db connect occured" + error.message);
      await this.handleConnectionError();
    }
  }
  async handleConnectionError() {
    if (this.retryCount < MAX_RETRY) {
      this.retryCount++;
      console.log(
        `Retrying to connect to MongoDB in ${RETRY_INTERVAL / 1000} seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve;
        }, RETRY_INTERVAL)
      );

      return this.connectDB(this.databaseUrl);
    } else {
      console.error("Max retry limit reached for db connection");
      process.exit(1);
    }
  }
  async handleDisconnect() {
    if (!this.isconnected) {
      console.log("Attempting to reconnect");
      await this.connectDB(this.databaseUrl);
    }
  }
  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    } catch (error) {
      console.error("Error in closing db connection" + error.message);
      process.exit(1);
    }
  }
  getConnectionStatus() {
    return {
      isConnected: this.isconnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

const dbConnection = new databaseConnection();

export default dbConnection.connectDB.bind(dbConnection);
export const getdbStatus = dbConnection.getConnectionStatus.bind(dbConnection);
