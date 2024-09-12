

const menu = {
    id: 1,
    imageURL: "imageLink",    
    name: "Spaghetti",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti suscipit voluptate quasi vitae animi molestias harum alias odio consectetur provident eos veritatis quisquam dolore laborum ducimus ad, doloribus tenetur eligendi.",
    ingredients: ["Spaghetti", "Tomato sauce", "Meatballs"],
    category:"Dinner",
    price: 12.99,
    ratingsAverage:3.9,
    
    rating: 4,
    availability: true,
    createdAt: Date.now(),
    updatedAt:Date
    
}

 
console.log(menu.createdAt)



// itemId (String, Primary Key): A unique identifier for each menu item, typically a UUID or a MongoDB ObjectId.
// name (String): The name of the menu item.
// description (String): A detailed description of the menu item, including ingredients, preparation style, etc.
// category (String): The category to which the item belongs (e.g., Appetizer, Main Course, Dessert, Beverage).
// price (Number): The price of the menu item.
// availability (Boolean): Indicates whether the item is currently available for order.
// imageURL (String, Optional): A URL to an image of the menu item.
// allergens (Array of Strings, Optional): A list of allergens contained in the menu item (e.g., Dairy, Nuts, Gluten).
// spicinessLevel (Number, Optional): A rating of the spiciness of the item, on a scale of 1 to 5.
// preparationTime (Number, Optional): The estimated time in minutes required to prepare the item.
// rating (Number, Optional): The average rating of the item based on customer reviews.
// createdAt (Date, Default: Date.now): The date and time when the menu item was added.
// updatedAt (Date, Default: Date.now): The date and time when the menu item was last updated.