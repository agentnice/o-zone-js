// show acive/unactive checkbox flag
function toggleCheckbox() {

    const checkbox = document.querySelectorAll('.filter-check_checkbox');
    checkbox.forEach(function (element) {
        element.addEventListener('change', function () {
            if (this.checked) {
                this.nextElementSibling.classList.add("checked");
            } else {
                this.nextElementSibling.classList.remove("checked");
            }
        });
    });
}



//chow cart

function toggleCart() {
    const btnCart = document.getElementById('cart');
    const modalCart = document.querySelector('.cart');
    btnCart.addEventListener('click', () => {
        modalCart.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    const closeBtn = document.querySelector('.cart-close');
    closeBtn.addEventListener('click', () => {
        modalCart.style.display = 'none';
        document.body.style.overflow = '';
    });
}


//work with cards

function addCart() {
    const cards = document.querySelectorAll('.goods .card'),
        cartWrapper = document.querySelector('.cart-wrapper'),
        empty = document.getElementById('cart-empty'),
        count = document.querySelector('.counter');

    // add card to cart-list
    cards.forEach((card) => {
        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
            const cardClone = card.cloneNode(true);
            cartWrapper.appendChild(cardClone);
            showData();

            //remove from cart
            const removeBtn = cardClone.querySelector('.btn');
            removeBtn.textContent = 'Удалить из корзины';
            removeBtn.addEventListener('click', () => {
                cardClone.remove();
                showData();
            });
        });
    });



    // counter of cards
    function showData() {
        const cardsCart = cartWrapper.querySelectorAll('.card'),
            cardsPrice = cartWrapper.querySelectorAll('.card-price'),
            cardTotal = document.querySelector('.cart-total span');
        let sum = 0;
        count.textContent = cardsCart.length;
        cardsPrice.forEach((cardPrice) => {
            let price = parseFloat(cardPrice.textContent);
            sum += price;
        });
        
        cardTotal.textContent = sum;
        if (cardsCart.length !== 0) {
            empty.remove();
        } else {
            cartWrapper.appendChild(empty);
        }
    }
}



// фильтр акции и поиск

function actionPage() {

    const cards = document.querySelectorAll('.goods .card'),
          discountCheckbox = document.getElementById('discount-checkbox'),
          goods = document.querySelector('.goods'),
          min = document.getElementById('min'),
          max = document.getElementById('max'),
          search = document.querySelector('.search-wrapper_input'),
          searchBtn = document.querySelector('.search-btn');

    //show only HOT SALE
    discountCheckbox.addEventListener('click', () => {
        cards.forEach((card) => {
            if (discountCheckbox.checked) {
                if (!card.querySelector('.card-sale')) {
                    card.parentNode.style.display = 'none';
                }
            } else {
                card.parentNode.style.display = '';
            }
        });
    });
    //filter depent of input value
    function filterPrice() {
        cards.forEach((card) => {
            const cardPrice = card.querySelector('.card-price');
            const price = parseFloat(cardPrice.textContent);

            if ((min.value && price < min.value) || (max.value && price > max.value)) {
                card.parentNode.remove();
            } else {
                goods.appendChild(card.parentNode);
            }
        });
    }
    // фильтр по цене
    min.addEventListener('change', filterPrice);
    max.addEventListener('change', filterPrice);


    //поиск по названию 

    
    searchBtn.addEventListener('click',() => {
        const searchText = new RegExp(search.value.trim(), 'i');
        cards.forEach((card) => {
            const tittle = card.querySelector('.card-tittle');
            if (!searchText.test(tittle.textContent)) {
                card.parentNode.style.display = 'none';
            } else {
                card.parentNode.style.display = 'flex';
            }
        });

    });

}




// получение данных с сервера
function getData() {
    const goodsWrapper = document.querySelector("#goods");
    return fetch("./db/db.json")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Данные не были получены, ошибка: ${response.status}`);
            }
        })
        .then(data => {return data;})
        .catch(err => {
            console.warn(err);
            goodsWrapper.innerHTML = "<div style='color:red; font-size:30px'>Упс, что-то пошло не так</div>";
        });
}




//выводим карточки товара
function renderCards(data) {
    console.log(data.goods);
    const goodsWrapper = document.querySelector ('.goods');
    data.goods.forEach((good)=> {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
        card.innerHTML = `
            <div class="card" data-category='${good.category}'>
                ${good.sale ? '<div class="card-sale">🔥Hot Sale🔥</div>' : ''}
                <div class="card-img-wrapper">
                    <span class="card-img-top"
                        style="background-image: url('${good.img}')"></span>
                </div>
                <div class="card-body justify-content-between">
                    <div class="card-price" style="${good.sale ? 'color:red' : ''}">${good.price} ₽</div>
                    <h5 class="card-title">${good.title}</h5>
                    <button class="btn btn-primary">В корзину</button>
                </div>
            </div>
        `;
        goodsWrapper.appendChild(card);
    });
}

function renderCatalog(){
    const cards = document.querySelectorAll('.goods .card');
    const catalogList = document.querySelector('.catalog-list');
    const categories = new Set();
    const catalogBtn = document.querySelector('.catalog-button');
    const catalogWrapper = document.querySelector('.catalog');
    cards.forEach((card) => {
        categories.add(card.dataset.category);
    });
    categories.forEach((item) =>{
        const li = document.createElement('li');
        li.textContent = item;
        catalogList.appendChild(li);
    });
    catalogBtn.addEventListener('click', () => {
        if (catalogWrapper.style.display) {
            catalogWrapper.style.display = ''  ;  
        } else {
            catalogWrapper.style.display = 'block';
        }
        if(event.target.tagName === 'li') {
            cards.forEach((card) => {
                if(card.dataset.category === event.target.textContent) {
                    card.parentNode.style.display = '';
                } else {
                    card.parentNode.style.display = 'none';
                }
            });
        }
    });
    console.log(categories);
}


getData().then((data) =>{
    renderCards(data);
    toggleCheckbox();
    toggleCart();
    addCart();
    actionPage();
    renderCatalog();

});