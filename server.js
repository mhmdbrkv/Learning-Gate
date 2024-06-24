const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const ApiError = require("./utils/apiError");
const globalError = require("./Middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const mountRoutes = require("./Routes");
const { webhookCheckout } = require("./services/orderService");

//database connection
dbConnection();

//express app
const app = express();

// use express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Configure CORS with specific options
const corsOptions = {
  origin: "http://localhost:3000", // Allow a single origin
  credentials: true, // Allow cookies and HTTP authentication
};

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ["enrolled", "ratingsNumber", "avgRatings", "price", "level"],
  })
);

// Middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true }));

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/webhook-checkout")) {
        req.rawBody = buf.toString();
      }
    },
    limit: "100kb",
  })
);

app.options("*", cors());

//router mount
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`There is no such route: ${req.originalUrl}`, 400));
});

// Global Error Handler Middleware
app.use(globalError);

//listen server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app running on this ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting Down...");
    process.exit(1);
  });
});
