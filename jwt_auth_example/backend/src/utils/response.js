function response(res, statusCode = 200, success = true, data = {}) {
  return res.status(statusCode).json({success, data})
}

module.exports = response;
