class BaseDeDatos{
    constructor(){
        this.productos = [];
    }
    async traerRegistros() {
        const response = await fetch("../productos.json")
        this.productos = await response.json()
        return this.productos;
    }
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }
    registrosPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra))
    }
    registrosPorCategoria(categoria){
        return this.productos.filter((producto) => producto.categoria == categoria);
    }
}

class Producto {
    constructor(id, nombre, precio, categoria, imagen = false){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

class Carrito{
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"))
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }
    estaEnCarrito({ id }){
        return this.carrito.find((producto) => producto.id === id)
    }
    agregar(producto){
        const productoEnCarrito = this.estaEnCarrito(producto);
        if(productoEnCarrito){
            productoEnCarrito.cantidad++;
        }else {
            this.carrito.push({ ...producto, cantidad: 1 })
            localStorage.setItem("carrito", JSON.stringify(this.carrito))
        }
        this.listar();
        Toastify({
            text: `${producto.nombre} Fue agregado al carrito`,
            className: "info",
            position: "center",
            style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }

    quitar(id){
        const indice =  this.carrito.findIndex((producto) => producto.id === id);
        if(this.carrito[indice].cantidad > 1){
            this.carrito[indice].cantidad--;
        } else { 
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito))
        this.listar();
    }

    listar(){
        this.total = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.carrito){
            divCarrito.innerHTML += `
            <div class="producto">
                <h2>${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <p>Cantidad${producto.cantidad}</p>
                <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
            </div>`
            this.total += (producto.precio * producto.cantidad);
            this.totalProductos += producto.cantidad;
        }
        if(this.totalProductos > 0){
            btnComprar.className = "btn";
        } else {
            btnComprar.className = "oculto";
        }
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar){
            boton.onclick = (event) =>{
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));

            }
        }
        spanTotalCarrito.innerText = this.total;
        this.totalProductos = 0;
        spanCantidadProductos.innerText = this.totalProductos;
    }
    vaciar(){
        this.carrito = [];
        localStorage.removeItem("carrito");
        this.listar()
    }
}

const bd = new BaseDeDatos();

const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito")
const spanCantidadProductos = document.querySelector("#cantidadProductos")
const spanTotalCarrito = document.querySelector("#totalCarrito")
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const btnComprar = document.querySelector("#btnComprar");
const btnCarrito = document.querySelector("section h1")
const botonesCategoria = document.querySelectorAll(".btnCategoria")
const btnTodos = document.querySelector("#btnTodos")

botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", (event) =>{
        event.preventDefault();
        quitarClaseSeleccionado();
        boton.classList.add("seleccionado");
        const productosPorCategoria = bd.registrosPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    })
})

btnTodos.addEventListener("click", (event) =>{
        event.preventDefault();
        quitarClaseSeleccionado();
        btnTodos.classList.add("seleccionado");
        cargarProductos(bd.productos);
    })

    function quitarClaseSeleccionado(){
        const botonSeleccionado = document.querySelector(".seleccionado")
        if(botonSeleccionado){
            botonSeleccionado.classList.remove("seleccionado")
        }
    }

bd.traerRegistros().then((productos) => cargarProductos(productos));

function cargarProductos(productos){
        divProductos.innerHTML = "";
        for (const producto of productos){
        divProductos.innerHTML += `
        <div class="col-md-4">
        <div class="card mb-4">
            <img src="img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">$${producto.precio}</p>
                <a href="#" class="btn btn-primary btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        </div>
    </div>
    `;  
    }
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar){
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.agregar(producto);
        })
    }
}

btnComprar.addEventListener("click", (event) => {Swal.fire(
    'Compra Realizada',
    'Su pedido esta en preparación',
    'success'
)
    event.preventDefault();
    carrito.vaciar();
    btnComprar.classList.add("oculto")
})

inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
})

btnCarrito.addEventListener("click", () => {
    document.querySelector("section").classList.toggle("ocultar")
})

const carrito = new Carrito();
