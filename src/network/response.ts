const response = {
	success: (req, res, message: any, status: Number) => {
		let statusCode = status || 200;
		let statusMessage = message || "";

		res.status(status).send({
			error: false,
			status: status,
			body: message,
		});
	},
	error: (req, res, message: any, status: Number) => {
		let statusCode = status || 500;
		let statusMessage = message || "Internal server error";

		res.status(statusCode).send({
			error: false,
			status: status,
			body: message,
		});
	},
};

export default response;
