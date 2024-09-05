const Menu = require('./../models/menuModel')
const APIFeatures = require('./../utils/apiFeatures')  
const catchAsync = require('./../utils/catchAsync')

exports.getAllMenus = catchAsync( async(req, res) => {
        //EXECUTE QUERY       
        const features = new APIFeatures(Menu.find(), req.query)
            .filter()
            .sort().limitFields().paginate()
        const menus = await features.query;
        //const menus =await Menu.find()
        res.status(200).json({
            status: 'success',
            results: menus.length,
            data: menus
        })
})

exports.getMenu = async (req, res) => {

    const id = req.params.id 

    
    
    try {
        
        const menu = await Menu.findById(id)

        res.status(200).json({
            status: 'success',
            data: menu
        })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
                      
        })
    }
}



exports.createMenu = catchAsync(async (req, res,next) => {    
    
        const newMenu = await Menu.create(req.body);         
        res.status(201).json({
            status: 'success',
            data: newMenu
        });
    
})


exports.updateMenu = async (req, res) => {
    const id = req.params.id
    
    try {        
        const menu = await Menu.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: menu
        })
        
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }

}


exports.deleteMenu = async (req, res) => {
    const id = req.params.id*1
    try {
        await Menu.findByIdAndDelete(id)
        res.status(204).json({
            status: 'success',
            data: null
          });


    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message:error.message
        })
        
    }
}

