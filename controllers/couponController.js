const Coupon = require("../models/couponModel");
const factory = require("./handlersFactory");

exports.createCoupon = factory.createOne(Coupon);

exports.getCoupons = factory.getAll(Coupon);

exports.getCoupon = factory.getOne(Coupon);

exports.updateCoupon = factory.updateOne(Coupon);

exports.deleteCoupon = factory.deleteOne(Coupon);
