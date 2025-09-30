// [GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
module.exports.index = async (req,res)=>{
    let find = {
        deleted:false
    };

    //filter
    const filterStatus = filterStatusHelper(req);
    if(req.query.status){
        find.status = req.query.status
    };
    //search
    const objectSearch = searchHelper(req);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    };
    //pagi
    const countProducts = await Product.countDocuments(find);
    const objectPagi = paginationHelper(
        {
        currentPage:1,
        limitItem: 4,
        },
        req,
        countProducts
    );
    
    const products = await Product.find(find)
        .limit(objectPagi.limitItem)
        .skip(objectPagi.skip)
        .sort({position: "desc"});

    res.render("admin/pages/products/index",{
        pageTitle: "Trang Product",
        products: products,
        filterStatus:filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagi
    });
};
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id: id},{status: status});
    res.redirect(req.get("Referer") || "/admin/products");
};
module.exports.changeMulti = async (req,res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: ids}},{$set: {status: "active"}})
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}},{$set: {status: "inactive"}})
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}},{$set: {deleted: true, deleteAt: new Date()}})
            break;
        case "change-position":
            for(item of ids){
                let [id,position] = item.split("-");
                position = parseInt(position);
                await Product.updateMany({_id: id},{position: position});
            }
            break;
        default:
            break;
    }
    res.redirect(req.get("Referer") || "/admin/products");
};
module.exports.deleteProduct = async (req,res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id},{deleted: true, deleteAt: new Date()});
    res.redirect(req.get("Referer") || "/admin/products");
};