//requires
var mongoose = require("mongoose");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

//Modelos
var schemaC = require('./models/client.model')
var Client = mongoose.model("Client", schemaC, "clients");

var schemaP = require('./models/product.model')
var Product = mongoose.model("Product", schemaP, "product");

//Conexión
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/products', {useNewUrlParser: true});

function showData(data) {
    return {
        _id: data[0]._id,
        name: cryptr.decrypt(data[0].name),
        lastname: cryptr.decrypt(data[0].lastname),
        address: cryptr.decrypt(data[0].address),
        email: cryptr.decrypt(data[0].email),
        phone: cryptr.decrypt(data[0].phone),
        points: data[0].points
    }
}


//crud
function insert (n,l,a,e,p,po) {
    var client = new Client({
        name: cryptr.encrypt(n),
        lastname: cryptr.encrypt(l),
        address: cryptr.encrypt(a),
        email: cryptr.encrypt(e),
        phone: cryptr.encrypt(p),
        points: po
    });
    client.save((error,data) => {
        if (error) {
            console.log(error);
            process.exit(1);
        }
        console.log(data);
    });
}

function find (id) {
    Client.find({_id : id}, (error, data) => {
        if (error) {
            console.log(error);
            process.exit(1);
        }
        console.log(showData(data));
        process.exit(0);
    });
}

function update (id,n,l,a,e,p,po) {
    var client = {
        name: cryptr.encrypt(n),
        lastname: cryptr.encrypt(l),
        address: cryptr.encrypt(a),
        email: cryptr.encrypt(e),
        phone: cryptr.encrypt(p),
        points: po
    };
    Client.findByIdAndUpdate({_id:id},client,{new:true},(error,data) =>{
        if (error) {
            console.log(error);
            process.exit(1);
        }
        console.log(data);
        process.exit(0);
    });
}

function remove (id) {
    Client.findByIdAndRemove (id, (error,docs) => {
        if (error){
            console.log(error);
            process.exit(1);
        }
        console.log(docs);
        process.exit(0);
    });
};

function findProduct(id) {
    Product.find({_id : id}, (error, product) => {
        if (error) {
            console.log(error);
            process.exit(1);
        }
        console.log(product);
    });
}

//Comprar
function buy (clientid,productid) {
    Client.find({_id : clientid}, (error, client) => {
        if (error) {
            console.log(error);
            process.exit(1);
        }
        Product.find({_id : productid}, (error, product) => {
            if (error) {
                console.log(error);
                process.exit(1);
            }
            if(client[0].points >= product[0].cost) {
                update(client[0]._id, client[0].name, client[0].lastname, client[0].address, client[0].email, client[0].phone, client[0].points-product[0].cost);
                console.log("comprado");
            } else {
                console.log("puntos insuficientes");
            }
        });
    });
}

//Función auxiliar

//Acciones
//insert('Sergio','Alfaro', 'Mercurio 60','sealfarofa@ittepic.edu.mx','3111215684',500);
find('5cf9558e72ea5030d6f2b908');
//update('5cf94744c6ec3f289a8aa20b','Sergio','Alfaro', 'Mercurio 60','sealfarofa@ittepic.edu.mx','3111215684',1000);
//remove('5cf94744c6ec3f289a8aa20b');
//findProduct('5cf9347e4859b9472eca09ad');
//buy('5cf94744c6ec3f289a8aa20b','5cf93b6a118240b8cdfd9fce');
//buy('5cf94744c6ec3f289a8aa20b','5cf93b89118240b8cdfd9fd0');