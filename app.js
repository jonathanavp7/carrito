// Esta clase simula una base de datos. Vamos a cargar todos los productos de nuestro e-commerce
class BaseDeDatos {
    constructor() {
        this.productos = [];
        // Vamos a cargar todos los productos que tengamos
        this.AddRegistro(1, "IPhone 14 Pro Max azul", 750, "Celulares", "iphone-azul.png");
        this.AddRegistro(2, "IPhone 14 Pro Max rojo", 750, "Celulares", "iphone-rojo.png");
        this.AddRegistro(3, "IPhone 14 Pro Max verde", 750, "Celulares", "iphone-verde.png");
        this.AddRegistro(4, "IPhone 14 Pro Max blanco", 750, "Celulares", "iphone-blanco.png");
        this.AddRegistro(5, "IPhone 14 Pro Max negro", 750, "Celulares", "iphone-negro.png");
        this.AddRegistro(6, "IPhone 12 Pro Azul", 550, "Celulares", "iphone-12-pro-azul.png");
        this.AddRegistro(7, "IPhone 12 Pro Blanco", 550, "Celulares", "iphone-12-pro-blanco.png");
        this.AddRegistro(8, "IPhone 12 Pro Sellado", 550, "Celulares", "iphone-sellado.png");
    }

    AddRegistro(id, nombre, precio, categoria, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }

    traerRegistros() {
        return this.productos;
    }

    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id); 
    }

    registrosPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }
}

// Clase carrito
class Carrito {
    constructor() {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }

    enCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
    }

    add(producto) {
        let productoEnCarrito = this.enCarrito(producto);
        if (productoEnCarrito) {
            // Sumar cantidad
            productoEnCarrito.cantidad++;
        } else {
            // Agregar al carrito
            this.carrito.push({ ...producto, cantidad: 1 });  
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    listar() {
        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.carrito) {
            divCarrito.innerHTML += `
            <div class="productoCarrito">
                <h2>${producto.nombre}</h2>
                <p>${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <p><a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a></p>
            </div>
            `;
            this.total += (producto.precio * producto.cantidad);
            this.totalProductos += producto.cantidad;
        }

        if (this.totalProductos > 0) {
            botonComprar.classList.remove("oculto");
        } else {
            botonComprar.classList.add("oculto");
        }
        // Botones de quitar
        const botonesQuitar = document.querySelectorAll('.btnQuitar');
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            }
        }
        // Actualizamos variables carrito
        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }

    vaciar() {
        this.carrito = [];
        localStorage.removeItem("carrito");
        this.listar();
    }
}

// Clase molde para los productos
class Producto {
    constructor(id, nombre, precio, categoria, imagen = false) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

// Objeto de la base de datos
const bd = new BaseDeDatos();

// Elementos
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
const botonComprar = document.querySelector("#botonComprar");


// Llamamos la funcion
cargarProductos(bd.traerRegistros());

// Muestra los registros de la base de datos en nuestro HTML
function cargarProductos(productos) {
    divProductos.innerHTML = "";
    for (const producto of productos) {
        divProductos.innerHTML += `
            <div class="producto">
                <h2>${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <img src="img/${producto.imagen}" width="160" height="100" />
                <p><a href="#" class="btnAdd" data-id="${producto.id}">Agregar al carrito</a></p>
            </div>
        `;
    }
    // Botones de agregar al carrito
    const botonesAdd = document.querySelectorAll(".btnAdd");
    for (const boton of botonesAdd) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.add(producto);
        });
    }
}

// Evento buscador
inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});

// Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

botonComprar.addEventListener("click", () => {
    Swal.fire({
        title: "Tu pedido esta en camino",
        text: "Su compra ha sido realizada con éxito",
        icon: "success",
        cofirmButtonText: "Aceptar",
    })
    carrito.vaciar();
    botonComprar.classList.add("oculto");
})

// Objeto carrito
const carrito = new Carrito();

