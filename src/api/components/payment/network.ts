import express from "express";
import controller from "./controller";
import response from "../../../network/response";
const router = express.Router();

router.post("/", RequirePayment);

function RequirePayment(req, res, next) {
	controller
		.RequestPayment(req.body.amount)
		.then((data) => response.success(req, res, data, 201))
		.catch(next);
}

export default router;
