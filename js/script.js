//Inicio Variables globales
//Obtenemos la clase button del DOM. Son 8 botones "Comprar"en total
const clickButton = document.querySelectorAll(".button");
//Guardamos en un array todos los productos que se van a imprimir en el carrito
let cart = [];
const tbody = document.querySelector('tbody');

//Fin variables Globales
//En clickButton se guardan todos los distintos botones, entonces debemos recorrerlos para escuchar cada uno y capturar cada click.
clickButton.forEach(btn => {
    btn.addEventListener('click', addToCartItem)
});
//Con esta función agregamos cada ítem escuchado en el paso anterior al carrito.

function addToCartItem(e) {
    //Acá guardamos el botón al que se le hizo el click
    const button = e.target;
    //Necesitamos detectar a que ítem corresponde, usamos el metodo "closest" para  llegar al contenedor padre de dicho ítem
    const item = button.closest('.card');
    //Obtenemos el nombre del ítem al que se le ha hecho click
    const itemTitle = item.querySelector('.card-title').textContent;
    //Obtenemos el precio del ítem al que se le ha hecho click
    const itemPrice = item.querySelector('.price').textContent;
    //Obtenemos la imagen del ítem al que se le ha hecho click
    const itemImg = item.querySelector('.card-img-top').src;
    //Creamos un objeto con cada una de sus características
    const newItem = {
            title: itemTitle,
            price: itemPrice,
            image: itemImg,
            quantity: 1
        }
        //Creamos una función para agregar los ítems seleccionados al "cart" (array vacío)
    addItemCart(newItem);
}
//Esta función va a ir guardando cada ítem seleccionado en el array "cart"
function addItemCart(newItem) {

    //Aca colocamos la alerta de producto comprado
    const alert = document.querySelector('.alert');
    setTimeout(function() {
        alert.classList.add('hide');
    }, 2000);
    alert.classList.remove('hide')


    const inputElement = tbody.getElementsByClassName('input__element');
    //Verificamos si el producto ya esta cargado en el cart y utilizamos el método trim a los efectos de esta comparación.
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title.trim() === newItem.title.trim()) {
            cart[i].quantity++;
            const inputValue = inputElement[i];
            inputValue.value++;
            totalCart();
            return null;
        }
    }
    cart.push(newItem);
    renderCart();
    totalCart();

}
//Función para imprimir el cart
function renderCart() {
    tbody.innerHTML = '';
    cart.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCart');
        const content = `   <th scope="row">1</th>
                     <td class="table__products">
                     <img src=${item.image}  alt="">
                    <h6 class="title">${item.title}</h6>
                       </td>
                    <td class="table__price"><p>${item.price}</p></td>
                    <td class="table__quantity">
                      <input type="number" min="1" value=${item.quantity} class="input__element">
                      <button class="delete btn btn-danger">x</button>
                         </td>

        `;
        tr.innerHTML = content;
        tbody.append(tr);
        //Botón eliminar
        tr.querySelector('.delete').addEventListener('click', removeItemCart);
        //Select de cantidad
        tr.querySelector('.input__element').addEventListener('change', changeQuantity);

    });
}
//Función total cart
function totalCart() {
    let total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal');
    cart.forEach((item) => {
        const price = Number(item.price.replace("$", ""));
        total = total + price * item.quantity;

    });
    itemCartTotal.innerHTML = `Total $${total}`;
    addLocalStorage();
}

function removeItemCart(e) {
    const buttonDelete = e.target;
    const tr = buttonDelete.closest('.itemCart');
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title.trim() === title.trim()) {
            cart.splice(i, 1);

        }

    }

    //Aca colocamos la alerta de producto eliminado
    const alert = document.querySelector('.remove');
    setTimeout(function() {
        alert.classList.add('remove');
    }, 2000);
    alert.classList.remove('remove')

    tr.remove();
    totalCart();

}

function changeQuantity(e) {
    const changeSelect = e.target;
    const tr = changeSelect.closest('.itemCart');
    const title = tr.querySelector('.title').textContent;

    cart.forEach(item => {
        if (item.title.trim() === title.trim()) {
            //Evitamos que un usuario indique un valor menor a 1
            changeSelect < 1 ? (changeSelect.value = 1) : changeSelect;
            item.quantity = changeSelect.value;
            totalCart();
        }

    });
}

//jquery, aparece un mensaje en el carrito, desaparece y vuelve a aparecer.
$(document).ready(function() {
    $("#agradecimiento").slideUp(2000).slideDown(2000).fadeOut(1000).fadeIn(3000);

});

//LocalStorage
function addLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
window.onload = function() {
    const storage = JSON.parse(localStorage.getItem('cart'));
    if (storage) {
        cart = storage;
        renderCart();
        totalCart();

    }

}