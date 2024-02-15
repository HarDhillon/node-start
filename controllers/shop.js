const Product = require('../models/product')
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: "/products",
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            })
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId

    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: "/",
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            })
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
        })
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err))

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    let fetchedCart
    let newQuantity = 1

    req.user.getCart()
        // Check if product alread exists in cart
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }

            // * If existing product update quantity based on old quantity
            if (product) {
                const oldQuantity = product.cartItem.quantity
                newQuantity = oldQuantity + 1;
                return product
            }
            // * Return existing product we found above or find the product to be added by Id
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                // ? Sequelize will update through CartItem BUT we also need to let it know the quantity not just the ID
                through: { quantity: newQuantity }
            })
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}
