const AppError = require('./appError');

exports.uploadFiles = (req, next) => {
    const ext = req.files.photo.mimetype.split('/')[1];
    const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;

    if (!req.files.photo.mimetype.startsWith('image')) {
        return next(new AppError('Nur Bilder sind erlaubt.', 400))

    } else if (req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/png') {
        return next(new AppError('Bitte wählen Sie Bilder im JPG- oder PNG-Format.', 400));
    }

    let temp = req.files.photo.tempFilePath.split('/')
    let index = temp.length - 1;
    temp.splice(index, 1, req.files.filename)
    let joinedTemp = temp.join('/')

    req.files.photo.mv(joinedTemp + filename, (err) => {
        if (err) console.log(err)
    })

    req.files.filename = filename
    req.files.joinedTemp = joinedTemp + filename
}

exports.uploadMultipleFiles = (file, req, next) => {
    const ext = file.mimetype.split('/')[1];
    const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;

    if (!file.mimetype.startsWith('image')) {
        return next(new AppError('Nur Bilder sind erlaubt.', 400))

    } else if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        return next(new AppError('Bitte wählen Sie Bilder im JPG- oder PNG-Format.', 400));
    }

    let temp = file.tempFilePath.split('/')
    let index = temp.length - 1;
    temp.splice(index, 1, req.files.filename)
    let joinedTemp = temp.join('/')

    file.mv(joinedTemp + filename, (err) => {
        if (err) console.log(err)
    })

    req.files.filename = filename
    req.files.joinedTemp = joinedTemp + filename
}