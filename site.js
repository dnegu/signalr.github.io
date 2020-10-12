var connection;

function conectar(){
    var conexionClienteId="PruebaPy";
    
    connection = new signalR.HubConnectionBuilder()
        //.withAutomaticReconnect([0, 1000, 10000]) .withAutomaticReconnect()
        .withUrl("http://desarrollo.sreasons.com:8081/msmensajeriaapps/MSMensajeria/mensajeria-hub?ClienteId="+conexionClienteId).build();

    async function start() {
        try {
            await connection.start();
            console.assert(connection.state === signalR.HubConnectionState.Connected);
            console.log("[CONECTADO]");
        } catch (err) {
            console.log(err);
            console.assert(connection.state === signalR.HubConnectionState.Disconnected);
            setTimeout(() => start(), 5000);
        }
    };

    connection.onclose(async () => {
        await start();
    });

    start();

    connection.on("enviarSMS", function (mensaje, idMensaje){
        console.log("El Hub llamo al metodo local de envio: {"+"enviarSMS"+"} con el argumento: {"+mensaje+"} y el id mensaje: {"+idMensaje+"}");
    });
    
    connection.on('restar', function (mensaje, idMensaje){
        console.log("El Hub llamo al metodo local de envio: {restar} con el argumento: {"+mensaje+"} y el id mensaje: {"+idMensaje+"}");
    });

    connection.on("consumoSMS", function (mensaje, idMensaje){
        console.log("El Hub llamo al metodo local de consumo: {"+"enviarSMS"+"} con el argumento: {"+mensaje+"} y el id mensaje: {"+idMensaje+"}");
    });
}

function desconectar(){
    if (connection) {
        connection.stop();
        connection= undefined;
    }
}

// llama un metodo de hub desde el cliente
function enviar(argumento){
    
    var mensaje={
        Grupo:"grupo123",
        Metodo:"enviarSMS",
        Argumento: argumento,
    };
    /*if(document.getElementById("Destinos").value.length>0){
        mensaje.Destinos=[document.getElementById("Destinos").value];
    }*/
    connection.invoke("Enviar",mensaje).catch(function (err) {
        return console.error(err.toString());
    });
    console.log("El cliente invoco el metodo remoto Enviar del Hub con el argumento:" +mensaje);
}

function consumir(consumoargumento){
    var mensaje={
        Id:"consumoSMS",
        Grupo:"consumogrupo123",
        Metodo:"consumoSMS",
        Argumento:consumoargumento
    };
    connection.invoke("Consumir",mensaje).catch(function (err) {
        return console.error(err.toString());
    });
    console.log("El cliente invoco el metodo remoto Consumir del Hub con el argumento:" +mensaje);
}


function subscribe(){
    connection.invoke("Subscribe","grupo123").catch(function (err) {
        return console.error(err.toString());
    });
    console.log("Se suscribio al grupo:" +"grupo123");
}

function unsubscribe(){
    connection.invoke("Unsubscribe","grupo123").catch(function (err) {
        return console.error(err.toString());
    });
    console.log("Se des suscribio al grupo:" +"grupo123");
}



// revisar el consumo, no esta llegando
