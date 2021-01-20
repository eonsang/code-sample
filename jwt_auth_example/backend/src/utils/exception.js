function exception(statusCode, message) {
  return {
    status: statusCode,
    message
  }
}

module.exports = exception;
