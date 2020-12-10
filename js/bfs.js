document.querySelector('#generarArchivo').addEventListener('click',traerDatos);
let agrandarRadio = false;
let arreglo = [];
let arbolBorrado = false;

function traerDatos (){
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET','listaNúmeros.json',true);
    xhttp.send();
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200) {
            
            let resultado = document.querySelector('#resultado');
            resultado.innerHTML = `${this.responseText}`;
            let arreglo = this.responseText;
            let izquierda = arreglo.split("[");
            let derecha = izquierda[1].split("]");
            let nuevo = derecha[0].split(",");
            
            añadirArregloJSON(nuevo);
        }
    }

}

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const LEFT = 0
const RIGHT = 1

class Node {
    constructor(value) {
        this.value = value
        this.children = []
        this.parent = null
        this.pos = { x: 0, y: 0 }
        this.r = 20 // Cambiar de tamaño
    }

    get left() {
        return this.children[LEFT]
    }

    set left(value) {
        value.parent = this
        this.children[LEFT] = value
    }

    get right() {
        return this.children[RIGHT]
    }

    set right(value) {
        value.parent = this
        this.children[RIGHT] = value
    }

    set position(position) {
        this.pos = position
    }

    get position() {
        return this.pos
    }

    get radius() {
        return this.r
    }

}

class Tree {
    constructor() {
        this.root = null;
        this.startPosition = { x: 800, y: 44 }
        this.axisX = 250
        this.axisY = 80

    }

    getPosition({ x, y }, isLeft = false) {
        return { x: isLeft ? x - this.axisX + y : x + this.axisX - y, y: y + this.axisY }
    }

    add(value) {
        const newNode = new Node(value);
        if (this.root == null) {
            newNode.position = this.startPosition
            this.root = newNode
        }
        else {
            let node = this.root
            while (node) {
                if (node.value == value){
                    window.alert("El nodo ya existe.");
                    break;
                }
                if (value > node.value) {
                    if (node.right == null) {
                        newNode.position = this.getPosition(node.position)
                        node.right = newNode
                        break;
                    }
                    node = node.right
                }
                else {
                    if (node.left == null) {
                        newNode.position = this.getPosition(node.position, true)
                        node.left = newNode
                        break;
                    }
                    node = node.left
                }
            }
        }
    }
    
    all(node) {

        if (node === undefined)
            return
        else {

            console.log(node.value)
            arreglo.push(parseInt(node.value))
            this.all(node.left)
            this.all(node.right)
        }
 
        
    }

    
    find(data) {
        let current = this.root;
        while (current.value !== data) {
          if (data < current.value) {
            current = current.left;
          } else {
            current = current.right;
          }
          if (current === undefined) {
            
            return undefined;
          }
        }
        
        return current.value;
    }

    getAll() {
        this.all(this.root)
    }

    bfs() {
        const queue = [];
        const black = "#000"

        queue.push(this.root);

        while (queue.length !== 0) {
            const node = queue.shift();
            const { x, y } = node.position

            const color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
            ctx.beginPath();
            ctx.arc(x, y, node.radius, 0, 2 * Math.PI)
            ctx.strokeStyle = black
            ctx.fillStyle = color
            ctx.fill()
            ctx.stroke()
            ctx.strokeStyle = black
            ctx.strokeText(node.value, x, y)


            node.children.forEach(child => {

                const { x: x1, y: y1 } = child.position;
                ctx.beginPath();
                ctx.moveTo(x, y + child.radius);
                ctx.lineTo(x1, y1 - child.radius)
                ctx.stroke();
                queue.push(child)
            });

        }
    }

    findNodoEncontrado(data) {
        let current = this.root;
        while (current.value !== data) {
          if (data < current.value) {
            current = current.left;
          } else {
            current = current.right;
          }
          if (current === undefined) {
            
            return undefined;
          }
        }
        
        return current;
    }

    bfsNodoEncontrado(dato) {
        const queue = [];
        const black = "#000"

        queue.push(this.root);

        while (queue.length !== 0) {
            const node = queue.shift();
            const { x, y } = node.position

            const color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
            ctx.beginPath();

            if (node.value === dato) {
                ctx.arc(x, y, node.radius+12, 0, 2 * Math.PI)
            }else {
                ctx.arc(x, y, node.radius, 0, 2 * Math.PI)
            }
            
            ctx.strokeStyle = black
            ctx.fillStyle = color
            ctx.fill()
            ctx.stroke()
            ctx.strokeStyle = black
            ctx.strokeText(node.value, x, y)


            node.children.forEach(child => {

                const { x: x1, y: y1 } = child.position;
                ctx.beginPath();
                ctx.moveTo(x, y + child.radius);
                ctx.lineTo(x1, y1 - child.radius)
                ctx.stroke();
                queue.push(child)
            });

        }
    }

}

let t = new Tree();
let p = new Tree();

function añadir (){
        let número = parseInt(document.getElementById("númeroIngresado").value);
        console.log(número);
        t.add(número);
        t.bfs();
}

function addArbolCambiado(arregloNuevo){
    for (let i = 0; i < arregloNuevo.length; i++) {
        p.add(arregloNuevo[i]);
    }
    p.bfs()
}
function añadirArregloJSON (arreglo) {

    for (let i = 0; i < arreglo.length; i++) {
        t.add(parseInt(arreglo[i]));
        
    }
    t.bfs();
}

function buscarNumero () {
 
    if(!arbolBorrado){
        let número = parseInt(document.getElementById("númeroBuscado").value);
        console.log(número);
        let dato = t.find(número);

        if (dato == número) {
            window.alert("El Nodo Sí existe.");
         t.bfsNodoEncontrado(dato);

        }else {
         window.alert("El Nodo No existe.");
        }
        t.bfs();
    }else{
        let número = parseInt(document.getElementById("númeroBuscado").value);
        console.log(número);
        let dato = p.find(número);

        if (dato == número) {
            window.alert("El Nodo Sí existe.");
            p.bfsNodoEncontrado(dato);

        }else {
            window.alert("El Nodo No existe.");
        }
        p.bfs();
    }
    

}

function eliminar() {

    let númeroEliminar = parseInt(document.getElementById("númeroEliminado").value);
    console.log(númeroEliminar);
    let dato = t.find(númeroEliminar);


    if (dato == númeroEliminar) {
        window.alert("Se eliminará el "+dato);

        t.bfsNodoEncontrado(dato); //Agrandar el círculo
        t.getAll(); //Tomar el tamaño del los nodos, añadir al "arreglo[]"
        console.log(arreglo);

        let arregloNuevo = [];
        for (i = 0;i < arreglo.length;i++){
            if(arreglo[i] !== dato){
                arregloNuevo.push(arreglo[i]);
            }
        }

        /* arreglo = arregloNuevo /
        / Pa' eliminar el tablero */
        let canvas = document.getElementById('myCanvas');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height)


        arbolBorrado = true;
        console.log(arregloNuevo +'arreglo nuevo')
        addArbolCambiado(arregloNuevo)
        p.bfs();
    }else {
        window.alert("No se encontró el nodo a eliminar.");
        t.bfs();
    }

}
