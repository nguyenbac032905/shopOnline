const Product = require("../../models/product.model");
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).limit(4);
    const newProducts = products.map(item => {
        item.newPrice = (item.price*(1 - item.discountPercentage/100)).toFixed(2);
        return item;
    });
    res.render("client/pages/products/index",{
        pageTitle: "trang product",
        products: newProducts
    });
};