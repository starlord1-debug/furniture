
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');



let listProduct =[];
let carts =[];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})



const addDataToHTML = () =>{
    listProductHTML.innerHTML = '';
    if(listProduct.length > 0){
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price} $</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }




 
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
})

const addToCart = (product_id) =>{
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <=0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id:product_id,
            quantity:1
        });
    } else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1
    }
    addCartToHTML();
    //here i will make the data of cart products to be save evenif the user reloads the pages 
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));//هستخدم فايل json  عشان اعمل تخزين للبيانات  
}



const addCartToHTML = ( ) =>{
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('items');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];
            newCart.innerHTML = `
             <div class="item">
             <div class="image">
                <img src="${info.image}" alt="">
             </div>    
             <div class="name">
                ${info.name}
             </div>
             <div class="totalPrice">
                ${info.price * cart.quantity}
             </div>
             <div class="quantity">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
             </div>
            </div>
        </div>
            
            `;
            listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}
//دلوقتي هشتغل على سهمين بحيث اضغط عليهم عدد المنتج يتغير

listCartHTML.addEventListener('click',(event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus') ){
       let  product_id = positionClick.parentElement.dataset.id;
       let type = 'minus';
       if(positionClick.classList.contains('plus')){
        type = 'plus';
       }
       changeQuantity(product_id,type);
    }
}) 
const changeQuantity = (product_id,type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = carts[positionItemInCart];
        switch(type){
            case 'plus':
               carts [positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
               break;

            default:
                let valueChange = carts[positionItemInCart].quantity -1;
                if(valueChange > 0){
                    carts [positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart,1);//if the product count equal to zero so we have to delete it with splice function
                }
                break;

        }
    }
    addCartToMemory(); //just to update the data in the memory by this function;
    addCartToHTML(); //just to update data when refresh appear on the screen ;
}





const initApp = () =>{
  //here i will call the data from jason file which is already typed by fetch "schema"
  fetch('products.json')
  .then(response => response.json())
  .then(data =>{
    listProduct = data;
    addDataToHTML();
    //هاخد البيانات من السلة 

    if(localStorage.getItem('cart')){
        carts = JSON.parse(localStorage.getItem('cart')); //عشان اعرف اشغلها هحولها لarray  ب json 
        addCartToHTML();
    }
  })



}
initApp();