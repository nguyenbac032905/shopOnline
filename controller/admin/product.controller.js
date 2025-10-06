// [GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
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
    req.flash("success","cập nhật trạng thái thành công");
    res.redirect(req.get("Referer") || "/admin/products");
};
module.exports.deleteProduct = async (req,res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id},{deleted: true, deleteAt: new Date()});
    res.redirect(req.get("Referer") || "/admin/products");
};
module.exports.create = async (req,res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Tạo mới sản phẩm"
    })
};
module.exports.createPost = async (req,res) => {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }
    
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};
module.exports.edit = async (req,res) => {
    try {
        const id = req.params.id;
        let find = {
            deleted: false,
            _id: id
        };
        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit",{
            pageTitle: "Sửa Sản Phẩm",
            product:product
        });
    } catch (error) {
        req.flash("error","không tồn tại sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
module.exports.editPatch = async (req,res) => {
    const id = req.params.id
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne({_id:id},req.body);
        req.flash("success","cập nhật thành công");
    } catch (error) {
        req.flash("error","cập nhật thất bại");
    }
    res.redirect(req.get("Referer") || "/admin/products");
};
module.exports.detail = async (req,res) => {
    try {
        const id = req.params.id;
        let find = {
            deleted: false,
            _id: id
        };
        const product = await Product.findOne(find);
        res.render("admin/pages/products/detail",{
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
