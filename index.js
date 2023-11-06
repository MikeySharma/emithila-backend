const connectToMongo = require('./config/db');
const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const {notFound, errorHandler} = require('./middleware/errorHandler');
const authRouter = require('./routes/authRoute');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoute');
const uploadRouter = require('./routes/uploadRoute');
const blogRouter = require("./routes/blogRoute");
const colorRouter = require("./routes/colorRoute");
const productCategoryRouter = require("./routes/productCategoryRoute");
const blogCategoryRouter = require("./routes/blogCategoryRoute");
const brandCategoryRouter = require("./routes/brandCategoryRoute");
const EnquiryRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
// const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 4000;
const app = express();

connectToMongo();

// app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended: false}))
app.use(cookieParser())
app.use('/api/product', productRouter);
app.use('/api/user', authRouter);
app.use('/api/blog', blogRouter);
app.use('/api/product-category', productCategoryRouter)
app.use('/api/blog-category', blogCategoryRouter)
app.use('/api/brand-category', brandCategoryRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/color', colorRouter);
app.use('/api/enquiry', EnquiryRouter);
app.use('/api/upload', uploadRouter);

app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`furniture-backend listening at http://localhost:${port}`);
})

