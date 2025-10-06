const express = require("express");
const app = express();
//phải import dotenv thì mới dùng được
require("dotenv").config();
const port = process.env.PORT;
//nhúng route
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
//ket noi database
const database = require("./config/database");
database.connect();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
//tạo biến toàn cục
const systemConfig =require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;
//method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
//body parse
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
//public file
app.use(express.static(`${__dirname}/public`));
//khai báo express-flash
const flash = require('express-flash');
const cookieParser = require("cookie-parser");
const session = require("express-session");
//sử dụng flash
app.use(cookieParser('diencookieoday'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//gọi routes
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});