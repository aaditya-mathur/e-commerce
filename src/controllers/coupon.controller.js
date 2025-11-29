import { Coupon } from "../models/coupon.model.js";
import { asyncHandler, ApiError, ApiResponse } from "../utils/utils.index.js";

// TO GET AVAILABLE COUPONS
export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
  if (!coupon) {
    throw new ApiError(404, "no coupon available");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "here's your coupon", coupon));
});

// TO VALIDATE APPLIED COUPONS
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({
    code: code,
    userId: req.user._id,
    isActive: true,
  });
  if (!coupon) {
    throw new ApiError(404, "no coupon found");
  }
  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    throw new ApiError(400, "coupon expired");
  }
  return res.status(200).json(
    new ApiResponse(200, "valid coupon", {
      code: coupon.code,
      discount: coupon.discountPercentage,
    })
  );
});
