const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Therapeut = require('../models/therapeutModel')
const Therapy = require('../models/therapyModel')
const User = require('../models/userModel')
const cloudinary = require('cloudinary').v2
const { uploadFiles, uploadMultipleFiles } = require('./../utils/cloudinary')
const TherapeutEmail = require('../utils/Emails/TherapeutRelated')
const ClientEmail = require('../utils/Emails/ClientRelated')
const PacientEmail = require('../utils/Emails/PacientRelated')

// MIDLEWARE FOR FILES 
exports.checkForFiles = catchAsync(async (req, res, next) => {
    if (req.files) {
        if (req.files.photo) {
            uploadFiles(req, next)

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
                uploadMultipleFiles(key, req, next)

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
    const therapeuts = await User.find({ role: 'therapeut' })

    if (!therapeuts) {
        return next(new AppError('Es gibt keine results.', 404))
    }

    res.status(200).json({
        message: 'success',
        therapeuts
    })
})

exports.getOneTherapeut = catchAsync(async (req, res, next) => {
    const therapeut = await User.findOne({ _id: req.params.id })
        .populate('reviews', 'rating review pacient -therapeut')


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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        availableBookingDates: req.body.availableBookingDates,
        email: req.body.email,
        password: req.body.password,
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
    })

    // const URL = `https://treatwell-clone.vercel.app/authenticate/therapeuts`
    const URL = `https://gesundo24.de/authenticate/therapeuts`
    // const URL = `${req.protocol}://localhost:3000/authenticate/therapeuts`;

    try {
        await new TherapeutEmail().welcomeGreetings(newTherapeut, URL, req.body.password)
    } catch (err) {
        if (err) console.log(err)
    }

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

exports.updateTherapeut = catchAsync(async (req, res, next) => {
    const therapeut = await User.findOne({ _id: req.user._id })
    
    if (!therapeut) {
        return next(new AppError('Kein therapeut gefunden', 404))
    }

    try {
        therapeut.availableBookingDates = req.body.availableBookingDates

        if (req.files) {
            // Check for single file
            if (req.files.photo) {
                const publicId = therapeut.image && therapeut.image.split('/')[7].split('.')[0]
                therapeut.image = req.files.image || therapeut.image

                await cloudinary.api.delete_resources(publicId, { invalidate: true },
                    function (error, result) {
                        if (error) {
                            console.log(error)
                        }
                    });
            }

            // Check for multiple files
            if (req.files.multiplePhotos) {
               therapeut.images && therapeut.images.forEach(async image => {
                    const publicId = image.split('/')[7].split('.')[0]

                    await cloudinary.api.delete_resources(publicId, { invalidate: true },
                        function (error, result) {
                            if (error) {
                                console.log(error)
                            }
                        });
                })

                therapeut.images = req.files.bulk || therapeut.images
            }
        }

        therapeut.save({ validateBeforeSave: false })
    } catch (e) {
        if (e) {
            console.log(e)
        }
    }

    res.status(200).json({
        message: 'success',
        therapeut
    })
})

exports.updateTherapeutInfo = catchAsync(async (req, res, next) => {
    const therapeut = await User.findOne({ _id: req.params.id })

    if (!therapeut) {
        return next(new AppError('Kein therapeut gefunden', 404))
    }

    const newTherapy = await Therapy.create({
        name: req.body.name,
        category: req.body.category,
        therapeut: req.params.id,
        pacientId: req.user._id,
        price: req.body.price,
        appointedAt: req.body.appointedAt
    })

    try {
        therapeut.availableBookingDates = req.body.availableBookingDates
        therapeut.save({ validateBeforeSave: false })

        // await new ClientEmail().therapyBooked(req.user, therapeut)
        // await new TherapeutEmail().therapyBooked(req.user, therapeut)
        // await new PacientEmail().therapyBooked(req.user, therapeut)
    } catch (e) {
        if (e) {
            console.log(e)
        }
    }

    res.status(200).json({
        message: 'success',
        therapeut,
        newTherapy
    })
})

exports.becomePartner = catchAsync(async (req, res, next) => {
    try {
        // await new ClientEmail().becomePartner(req.body.therapeut)
        res.status(200).json({
            message: 'success'
        })
    } catch (e) {
        if (e) console.log(e)
    }
})
