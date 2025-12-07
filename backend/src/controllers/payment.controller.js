import { Coupon } from "../models/coupon.model.js";
import { Order } from "../models/order.model.js";
import {
  ApiError,
  ApiResponse,
  stripe,
  asyncHandler,
} from "../utils/utils.index.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(404, "cart is empty");
  }
  let totalAmount = 0;
  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100);
    totalAmount += amount * product.quantity;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity,
    };
  });

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: req.user._id,
      isActive: true,
    });
    if (coupon) {
      totalAmount -= Math.round(
        (totalAmount * coupon.discountPercentage) / 100
      );
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage),
          },
        ]
      : [],
    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
      products: JSON.stringify(
        products.map((product) => ({
          id: product._id,
          quantity: product.quantity,
          price: product.price,
        }))
      ),
    },
  });
  if (totalAmount >= 20000) {
    await createNewCoupon(req.user._id);
  }

  return res.status(200).json(
    new ApiResponse(200, "success", {
      id: session.id,
      totalAmount: totalAmount / 100,
    })
  );
});

export const checkoutSuccess = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        },
        {
          isActive: false,
        }
      );
    }
  }

  const products = JSON.parse(session.metadata.products);
  const newOrder = new Order({
    user: session.metadata.userId,
    products: products.map((product) => ({
      product: product.id,
      quantity: product.quantity,
      price: product.price,
    })),
    totalAmount: session.amount_total / 100,
    stripeSessionId: sessionId,
  });

  await newOrder.save();

  return res.status(200).json(
    new ApiResponse(200, "payment successful", {
      orderId: newOrder._id,
    })
  );
});

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();

  return newCoupon;
}