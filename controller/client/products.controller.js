const Product = require("../../models/product.model");
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).limit(4).sort({position: "desc"});
    const newProducts = products.map(item => {
        item.newPrice = (item.price*(1 - item.discountPercentage/100)).toFixed(2);
        return item;
    });
    res.render("client/pages/products/index",{
        pageTitle: "trang product",
        products: newProducts
    });
};
module.exports.detail = async (req,res) => {
    try {
        const slug = req.params.slug;
        let find = {
            deleted: false,
            slug: slug,
            status: "active"
        };
        const product = await Product.findOne(find);
        res.render("client/pages/products/detail",{
            pageTitle: "TRANG CHI TIẾT",
            product: product
        });
    } catch (error) {
        res.redirect("/products");
    };
}