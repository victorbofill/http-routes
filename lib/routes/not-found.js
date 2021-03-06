'use strict';

module.exports = (req, res) => {
    res.statusCode = 404;
    res.send({
        error: true,
        message: `Our sincere apologies. We could not ${req.method} ${req.url}`
    });
};