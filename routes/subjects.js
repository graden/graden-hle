var Subject = require('models/subject').Subject;

exports.create = function(req, res) {
    var fName    = req.body.fName;
    var sName    = req.body.sName;
    var tName    = req.body.tName;
    Subject.create(fName, sName, tName, function(err, subject) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(subject);
        }
    });
};

