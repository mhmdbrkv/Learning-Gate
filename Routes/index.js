const courseRoute = require("./courseRoute");
const sectionRoute = require("./sectionRoute");
const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const wishlistRoute = require("./wishlistRoute");
const learningRoute = require("./learningRoute");
const instructorRoute = require("./instructorRoute");
const orderRoute = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/courses", courseRoute);
  app.use("/api/v1/sections", sectionRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/learning", learningRoute);
  app.use("/api/v1/instructor", instructorRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoutes;
