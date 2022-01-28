const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Therapeut = require('../models/therapeutModel')
const cloudinary = require('cloudinary').v2
const { uploadFiles, uploadMultipleFiles } = require('./../utils/cloudinary')

// MIDLEWARE FOR FILES 
exports.checkForFiles = catchAsync(async (req, res, next) => {
    if (req.files) {
        if (req.files.photo) {
            uploadFiles(req)

            await cloudinary.uploader.upload(req.files.joinedTemp, (err, file) => {
                if (file) {
                    req.files.image = file.secure_url
                }
                if (err) {
                    console.log(err)
                }
            })
        }

        if (req.files.multiplePhotos) {
            const bulk = []
            for (let key of req.files.multiplePhotos) {
                uploadMultipleFiles(key, req)

                await cloudinary.uploader.upload(req.files.joinedTemp, (err, file) => {
                    if (file) {
                        bulk.push(file.secure_url)
                        req.files.bulk = bulk
                    }
                    if (err) {
                        console.log(err)
                    }
                })
            }
        }
    }
    next()
})

exports.getAllTherapeuts = catchAsync(async (req, res, next) => {
    const therapeuts = await Therapeut.find()

    if (!therapeuts) {
        return next(new AppError('Keine therapeuts sind gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        therapeuts
    })
})

exports.getOneTherapeut = catchAsync(async (req, res, next) => {
    const therapeut = await Therapeut.findOne({ _id: req.params.id })

    if (!therapeut) {
        return next(new AppError('Kein therapeut gefunden.', 404))
    }

    res.status(200).json({
        message: 'success',
        therapeut
    })
})

exports.createTherapeut = catchAsync(async (req, res, next) => {
    const newTherapeut = await Therapeut.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        qualifications: req.body.qualifications,
        biography: req.body.biography,
        website: req.body.website,
        specializedIn: req.body.specializedIn,
        specializedServices: req.body.specializedServices,
        location: req.body.location,
        image: req.files && req.files.image ? req.files.image : req.body.image,
        images: req.files && req.files.bulk ? req.files.bulk : req.body.bulk,
        locationCoordinates: {
            coordinates: [req.body.longitude, req.body.latitude]
        }
        // locationCoordinates: {
        //     coordinates: [8.239761, 50.078217]
        // }
    })

    res.status(201).json({
        message: 'success',
        newTherapeut
    })
})

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getTherapeutsWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitute and longitude in the format lat,lng.',
                400
            )
        );
    }

    const therapeuts = await Therapeut.find({
        locationCoordinates: { $geoWithin: { $centerSphere: [[8.239761, 50.078217], radius] } }
    });

    res.status(200).json({
        status: 'success',
        results: therapeuts.length,
        therapeuts
    });
});