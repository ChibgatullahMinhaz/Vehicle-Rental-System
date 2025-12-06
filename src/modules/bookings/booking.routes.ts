import { Router } from "express";
import { bookingsControllers } from "./booking.controller";
import { auth } from "../../middleware/auth";

const router = Router();
router.post("/", auth("admin", "customer"), bookingsControllers.makeBooking);
router.get("/", auth("admin", "customer"), bookingsControllers.getBookings);
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingsControllers.updateBooking
);

const bookingRoutes = router;
export default bookingRoutes;
