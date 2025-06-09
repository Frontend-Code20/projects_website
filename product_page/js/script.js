const productWrapper = document.getElementById('product-wrapper');
const productModal = document.getElementById('product-modal');

const modalImage = document.getElementById('modal-image');
const productName = document.getElementById('product-name');
const productDecription = document.getElementById('product-decription');
const productPrice = document.getElementById('product-price');
const ratingBox = document.getElementById('rating-box');
const ratingsCount = document.getElementById('ratings-count');
const stars = document.getElementById('stars');
const modalHide = document.getElementById('modal-hide');
const modalCartBtn = document.getElementById('modal-cart-btn');

const cartMessage = document.getElementById('cart-message');
const cartMessageHide = document.getElementById('cart-message-hide');

let productList = [];

window.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    productList = products;
    createCategorySections(products);
})

modalHide.addEventListener('click', () => {

    productModal.style.display = 'none'

});

cartMessageHide.addEventListener('click', () => {

    cartMessage.style.display = 'none'

});

modalCartBtn.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    addToCart(Number.parseInt(id));
});

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error: " + error);
    }
}

function createCategorySections(products = []) {

    const categories = getCategories(products);

    categories.forEach(category => {

        const section = createElement('section', 'product-section');
        const div = createElement('div', 'category-box');
        const h2 = createElement('h2', '', '', category);
        const hr = createElement('hr');
        const ul = createElement('ul', 'products');

        products.forEach(product => {

            if (product.category === category) {
                const li = createProductItem(product);
                ul.append(li)
            }

        });

        div.append(h2, hr);
        section.append(div, ul);
        productWrapper.appendChild(section)

    })

}

function createProductItem(product) {

    const li = createElement('li', 'product');

    const img = createElement('img');
    img.alt = product.title;
    img.src = product.image;

    const title = product?.title.length > 35 ? `${product.title.slice(0, 35)}...` : product.title
    const h3 = createElement('h3', 'product-title', '', title);

    const description = product?.description.length > 100 ? `${product.description.slice(0, 100)}...` : product.description
    const p = createElement('p', 'product-decr', '', description);

    const infodiv = createElement('div', 'card-text')

    const div1 = createElement('div', 'flexbox');
    const divRating = setRating(product.rating.rate);
    const h4 = createElement('h4', 'price', '', `${product.price}$`);

    const div2 = createElement('div', 'flexbox');
    const button1 = createElement('button', 'btn primary-btn', '', 'Add to Cart');
    const button2 = createElement('button', 'btn secondary-btn ', '', 'Details');

    button1.addEventListener('click', () => {
        addToCart(product.id);
    })

    button2.addEventListener('click', () => {
        showModal(product.id);
    });

    const morediv = createElement('div', 'more-products', '', `View more in ${product.category}`);

    infodiv.append(h3, p)
    div1.append(divRating, h4);
    div2.append(button1, button2);

    li.append(img, infodiv, div1, div2, morediv)

    return li;
}

function addToCart(id) {
    const cart = JSON.parse(window.localStorage.getItem('CART')) || [];
    const hasProduct = cart.find(item => item?.id === id);
    if(hasProduct){
        cart[cart.indexOf(hasProduct)].quantity++ 
    }else{
        const cartItem = {
            'id': id,
            'quantity': 1
        }
        cart.push(cartItem);
    }
    window.localStorage.setItem('CART', JSON.stringify(cart));
    cartMessage.style.display = 'flex'
}

function showModal(id) {

    const product = productList.find(product => product.id === id);
    if (product) {
        productModal.style.display = 'flex';
        modalImage.src = product.image
        productName.innerHTML = product.title
        productDecription.innerHTML = product.description
        productPrice.innerHTML = `${product.price}$`
        ratingsCount.innerHTML = product.rating.count
        modalCartBtn.setAttribute('data-id', id)
        stars.innerHTML = '';
        stars.appendChild(setRating(product.rating.rate))
    }

}

function setRating(rate) {

    const div = createElement('div', 'rating');

    let rating = Number.parseInt(rate);
    let pointValue = rate - rating;

    for (let i = 1; i <= 5; i++) {

        let tag = null;
        if (i < rating) {
            tag = createElement('i', 'fas fa-star')
        } else {
            if (pointValue > 0.5) {
                tag = createElement('i', 'fas fa-star-half-alt')
                pointValue = 0;
            } else {
                tag = createElement('i', 'far fa-star')
            }
        }
        div.appendChild(tag);
    }
    return div;
}

function getCategories(list = []) {
    const categ = [];

    list.forEach(product => {
        if (!categ.includes(product.category)) {
            categ.push(product.category);
        }
    })
    return categ;
}

function createElement(element, className, id, innerHTML = '') {

    const tag = document.createElement(element);
    className ? tag.setAttribute('class', className) : null
    id ? tag.setAttribute('id', id) : null
    tag.innerHTML = innerHTML

    return tag;
}
