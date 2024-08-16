const Menu = require('./../models/menuModel')

exports.getMenus = async (req, res) => {

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
    const newMenu = new Menu(req.body);
    try {
        await newMenu.save();
        res.status(201).json({
            status: 'success',
            data: newMenu
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
    
}