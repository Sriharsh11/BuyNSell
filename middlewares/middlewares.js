var Cart = require('../models/cart.js');

module.exports = function(req,res,next){
  if(req.user){
    var total = 0;
    Cart.findOne({owner: req.user._id},function(err,cart){
      if(err) return next(err);
      //console.log(cart);
      if(cart){
        total = cart.items.length;
        res.locals.cart = total;
      }
      else{
        res.locals.cart = 0;
      }
      next();
    });
  }
  else{
    next();
  }
}
