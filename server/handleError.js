
const SERVER_ERROR_MSG = 'Internal server error';

const handleError = (err, req, res) => {
  let responseStatus = 500;
  let responseMsg = SERVER_ERROR_MSG;

  if (err.response && err.response.status) {
    responseStatus = err.response.status;
    responseMsg = responseStatus === 500 ? SERVER_ERROR_MSG : err.response.data;

    res.status(responseStatus).send(responseMsg);
    return;
  }

  res.sendStatus(responseStatus);
};

module.exports = handleError;
