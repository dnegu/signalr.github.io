import logging
import sys
from signalrcore.hub_connection_builder import HubConnectionBuilder

server_url = "http://desarrollo.sreasons.com:8081/msmensajeriaapps/MSMensajeria/mensajeria-hub?ClienteId=PruebaPy"

hub_connection = HubConnectionBuilder()\
    .with_url(server_url)\
    .configure_logging(logging.DEBUG)\
    .with_automatic_reconnect({
        "type": "raw",
        "keep_alive_interval": 10,
        "reconnect_interval": 5,
        "max_attempts": 5
    }).build()

hub_connection.hub

hub_connection.on_open(lambda: print("connection opened and handshake received ready to send messages"))
hub_connection.on_close(lambda: print("connection closed"))

hub_connection.on("enviarSMS", print)
hub_connection.start()


username = "david"
message = "{\"Grupo:\"grupo123\",Metodo:\"enviarSMS\", Argumento: {\"Mensaje\":\"pls\"} }"

hub_connection.send("Subscribe", [username, "grupo123"])
hub_connection.send("Enviar", [username, message])

hub_connection.stop()

sys.exit(0)