//Variáveis auxiliares
const d = (el) => document.querySelector(el);
const da = (el) => document.querySelectorAll(el);

let modalQt = 1;
let modalKey = 0;
let cart = [];

//Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = d('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        
        modalKey = key;
        modalQt = 1;

        d('.pizzaBig img').src = pizzaJson[key].img;
        d('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        d('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        d('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toFixed(2);
        d('.pizzaInfo--size.selected').classList.remove('selected');
        da('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });
        d('.pizzaInfo--qt').innerHTML = modalQt;

        d('.pizzaWindowArea').style.display = 'flex';
        d('.pizzaWindowArea').style.opacity = 0;
        setTimeout(() => d('.pizzaWindowArea').style.opacity = 1, 200)

    });

    d('.pizza-area').append(pizzaItem);
});

//Eventos do modal

function closeModal() {
    d('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        d('.pizzaWindowArea').style.display = 'none';
    }, 500);
};
da('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
});


d('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        d('.pizzaInfo--qt').innerHTML = modalQt;

        let price = pizzaJson[modalKey].price * modalQt;
        d('.pizzaInfo--actualPrice').innerHTML = price.toFixed(2);
    }
});
d('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    d('.pizzaInfo--qt').innerHTML = modalQt;

    let price = pizzaJson[modalKey].price * modalQt;
    d('.pizzaInfo--actualPrice').innerHTML = price.toFixed(2)
});

da('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        d('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

d('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(d('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identifier = pizzaJson[modalKey].id +'@'+ size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    };

    updateCart();
    closeModal();
});

d('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        d('aside').style.left = '0'
    }
})
d('.menu-closer').addEventListener('click', () => {
    d('aside').style.left = '100vw'
})

function updateCart () {
    d('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        d('aside').classList.add('show');
        d('.cart').innerHTML = '';  
        
        let subtotal = 0;
        let discount = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1: 
                    pizzaSizeName = 'M'
                    break;
                case 2: 
                    pizzaSizeName = 'G'
                    break;    

            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            let cartItem = d('.models .cart--item').cloneNode(true);
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;

                updateCart();
            });

            d('.cart').append(cartItem);
        }
        
        discount = subtotal * 0.1;
        total = subtotal - discount;

        d('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        d('.discount span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        d('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;;

    } else {
        d('aside').classList.remove('show');
        d('aside').style.left = '100vw';
    };

    
}

