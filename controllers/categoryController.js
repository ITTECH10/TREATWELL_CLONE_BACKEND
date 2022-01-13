const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Category = require('../models/categoryModel')

exports.createCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create({
        name: req.body.name
    })

    res.status(201).json({
        message: 'success',
        newCategory
    })
})

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find()

    if (!categories) {
        return next(new AppError('Es wurden keine Kategorien gefunden', 404))
    }

    res.status(200).json({
        message: 'success',
        categories
    })
})