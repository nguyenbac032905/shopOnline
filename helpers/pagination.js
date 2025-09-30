module.exports = (objectPagi,req,countProducts)=> {
    if(req.query.page){
        objectPagi.currentPage = parseInt(req.query.page);
    }
    objectPagi.skip = (objectPagi.currentPage - 1)*objectPagi.limitItem;

    const totalPage = Math.ceil(countProducts/objectPagi.limitItem);
    objectPagi.totalPage = totalPage;
    return objectPagi;
}