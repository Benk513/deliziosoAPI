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