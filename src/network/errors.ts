import response from "./response";

function errors(err, req, res, next): void {
	if (err.statusCode == undefined || err.statusCode == 500) {
		console.log(err);
	}

	const message = err.message || "Error interno";
	const status = err.statusCode || 500;

	response.error(req, res, message, status);
}

export default errors;
