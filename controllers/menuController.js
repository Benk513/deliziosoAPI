const Menu = require('./../models/menuModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const multer = require('multer')

//configure the file location and filetype
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/menus')
    },
    filename: (req, file, cb) => {
        // const extName = file.mimetype.split('/')[1]
        const fileName = file.originalname
        cb(null, `${fileName.toLowerCase()}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Only images are allowed', 400), false)
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 500000 },
})

exports.uploadMenuPhoto= upload.single('imageURL')

exports.getAllMenus = catchAsync(async (req, res, next) => {
    //EXECUTE QUERY       
    const features = new APIFeatures(Menu.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const menus = await features.query;
    //const menus =await Menu.find()
    res.status(200).json({
        status: 'success',
        results: menus.length,
        data: menus
    })
})

exports.getFeaturedMenus = catchAsync(async (req, res, next) => {
    const featuredMenus = await Menu.find({ isFeatured: true })
    if (!featuredMenus) return next(new AppError('No featured products found', 404))

    return res.status(200).json({
        status: 'success',
        results: featuredMenus.length,
        data: featuredMenus

    })

})

exports.getMenu = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const menu = await Menu.findById(id).populate('reviews');

    if (!menu) return next(new AppError('No menu found with that ID', 404))

    res.status(200).json({
        status: 'success',
        data: menu
    })
})


exports.createMenu = catchAsync(async (req, res, next) => {
    const { name, category, price, description, ingredients, image } = req.body

 
    const newMenu = await Menu.create({
        name,
        category,
        price,
        description,
        ingredients,
        imageURL: req.file.filename
    });
    res.status(201).json({
        status: 'success',
        data: newMenu
    });

})

exports.updateMenu = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const menu = await Menu.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    if (!menu) return next(new AppError('No menu found with that ID', 404))

    res.status(200).json({
        status: 'success',
        data: menu
    })
})

exports.deleteMenu = catchAsync(async (req, res, next) => {
    const id = req.params.id * 1
    const menu = await Menu.findById(id)

    if (!menu) return next(new AppError('No menu found with that ID', 404))

    if (menu.image) {
        const publicId = menu.image.split('/').pop().split(".")[0];
        await cloudinary.uploader.destroy(`menus/${publicId}`);
        console.log('deleted image from cloudinary')

    }
    await Menu.findByIdAndDelete(id)


    res.status(204).json({
        status: 'success',
        data: null
    });
})


exports.getRecommandedMenus = catchAsync(async (req, res, next) => {
    const menus = await Menu.find({}).populate('reviews').sort({ rating: -1 }).
        limit(3)
    res.status(200).json({
        status: 'success',
        data: menus
    })
})


exports.getMenusByCategory = catchAsync(async (req, res, next) => {
    const category = req.params.category

    const menus = await Menu.find({ category })

    res.status(200).json({
        status: 'success',
        data: menus
    })

})


exports.toggleFeaturedMenus = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const menu = await Menu.findById(id)

    if (!menu) return next(new AppError('No menu found with that ID', 404))

    menu.isFeatured = !menu.isFeatured

    await menu.save()
    res.status(200).json({
        status: 'success',
        data: menu
    })
})