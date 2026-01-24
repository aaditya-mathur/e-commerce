import { Coupon } from "../models/coupon.model.js";
import { asyncHandler, ApiError, ApiResponse } from "../utils/utils.index.js";
import { validateCouponPostRequestBodySchema } from "../validations/request.validation.js";

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
  const validationResult =
    await validateCouponPostRequestBodySchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      "validation failed",
      validationResult.error.format()
    );
  }

  const { code } = validationResult.data;

  const coupon = await Coupon.findOne({
    code: code,
    userId: req.user._id,
    isActive: true,
  });

  if (!coupon) {
    throw new ApiError(404, "invalid coupon");
  }

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    throw new ApiError(400, "coupon expired");
  }

  return res.status(200).json(
    new ApiResponse(200, "valid coupon", {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    })
  );
});