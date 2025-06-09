const cart = document.getElementById('cart');
const shop = document.getElementById('shop-btn');
const cartSection = document.getElementById('cart-section');
const emptyCart = document.getElementById('empty-cart');
const cartBox = document.getElementById('cart-box');

cart.addEventListener('click', () => {

    const cart = JSON.parse(window.localStorage.getItem('CART')) || []

    // From script.js
    productWrapper.style.display = 'none'

    cartSection.style.display = 'flex'
    displayCartItems(cart);
});

shop.addEventListener('click', () => {

    // From script.js
    productWrapper.style.display = 'block'

    cartSection.style.display = 'none'

});

function displayCartItems(cart = []) {

    if (cart.length === 0) {
        cartBox.innerHTML = '';
        emptyCart.style.display = 'flex'
    } else {
        emptyCart.style.display = 'none'
        cartBox.innerHTML = ''
        cart.forEach(({ id, quantity }) => {

            const product = productList.find(item => item.id === id);
            const li = createCartItem(product, quantity);
            cartBox.appendChild(li);
        });
    }
}

function createCartItem(product, quantity) {

    const li = createElement('li', 'cart-item');
    const img = createElement('img', 'cart-item-image');
    img.src = product.image

    const productName = product.title.length > 18 ? `${product.title.slice(0, 18)}...` : product.title
    const h3 = createElement('h3', 'cart-product-name', '', productName);
    const div1 = createElement('div', 'flexbox price-box');
    const div2 = createElement('div', 'cart-price-text');
    const div3 = createElement('div', 'cart-price-text');

    const span1 = createElement('span', 'text-muted', '', 'Price');
    const span2 = createElement('span', 'text-muted', '', 'Total Price');
    const spanPrice = createElement('span', 'cart-price', '', `${product.price}$`);
    const spanTotal = createElement('span', 'cart-price', '', `${product.price * quantity}$`);

    const input = createElement('input', 'quantity')
    input.setAttribute('min','1');
    input.setAttribute('type', 'number');
    input.setAttribute('value', quantity);

    input.addEventListener('input', (event) => {
        increaseAndDecreaseQuantity(event, product.id, product.price);
    });

    const div4 = createElement('div', 'flexbox')
    const button1 = createElement('button', 'btn secondary-btn', '', 'Details');
    const button2 = createElement('button', 'btn danger-btn', '', 'Remove');

    button1.addEventListener('click', () => {
        // From script.js
        showModal(product.id);
    });

    button2.addEventListener('click', () => {
        removeItemFromCart(product.id);
    });

    div2.append(span1, spanPrice);
    div3.append(span2, spanTotal);
    div1.append(div2, div3)

    div4.append(button1, button2)

    li.append(img, h3, div1, input, div4);

    return li;
}

function removeItemFromCart(id) {

    const cart = JSON.parse(window.localStorage.getItem('CART')) || [];

    if (cart && cart.length > 0) {
        const newCart = cart.filter(item => item.id !== id);
        console.log(newCart);
        window.localStorage.setItem('CART', JSON.stringify(newCart));
        displayCartItems(newCart);
    }
}

function increaseAndDecreaseQuantity(event, id, price){
    
    const value = Number.parseInt(event.target.value); 
    const siblingElement = event.target.previousSibling;
    const totalPriceElement = siblingElement.children[1].children[1]
    
    const cart = JSON.parse(window.localStorage.getItem('CART')) || [];
    cart.forEach((item, idx) => {
        if(item.id === id){
            cart[idx].quantity = value;
            totalPriceElement.innerHTML = (price*value).toFixed(2);
        }
    });

    window.localStorage.setItem('CART', JSON.stringify(cart));
}