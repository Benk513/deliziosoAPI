const Menu = require('./../models/menuModel')

exports.getAllMenus = async (req, res) => {

    try {
        
        const menus = await Menu.find()

        res.status(200).json({
            status: 'success',
            results: menus.length,
            data: menus
        })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
                      
        })
    }

    
}

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

exports.createMenu = async (req, res) => {
     
    try {
        const newMenu = await Menu.create(req.body);         
        res.status(201).json({
            status: 'success',
            data: newMenu
        });

        res.status(201).json({
            status: 'success',
            data: newMenu
        })


    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
    
}


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
    const id = req.params.id
    

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

 