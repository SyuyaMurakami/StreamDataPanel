import os
import math
import asyncio
import json
import random
import logging
from datetime import datetime
import websockets
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

pathJson = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json' )

with open(pathJson, 'r', encoding='utf-8') as f:
    config = json.load(f)

host = config['WEBSOCKET_CONFIG']['HOST']
port = config['WEBSOCKET_CONFIG']['PORT']
route = config['WEBSOCKET_CONFIG']['ROUTE_PATH']

async def generate_data(chart_type: str, key_word: str):
    """generate dynamic data according to chart_type and key_word"""
    if key_word != 'test':
        return None
    elif chart_type in ['sequence', 'line', 'bar']:
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": round(random.uniform(50, 150), 2)
        }
    elif chart_type in ['sequences', 'lines', 'bars']:
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": {
                "A": round(random.uniform(50, 150), 2),
                "B": round(random.uniform(30, 130), 2),
            }
        }
    elif chart_type == 'scatter':
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": [round(random.uniform(50, 150), 2), round(random.uniform(30, 130), 2)]
        }
    elif chart_type == 'area':
        dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        value = [round(random.uniform(50, 150), 2) for _ in dimension]
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": [dimension, value]
        }
    elif chart_type == 'areas':
        dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        valueA = [round(random.uniform(50, 150), 2) for _ in dimension]
        valueB = [round(random.uniform(50, 150), 2) for _ in dimension]
        series = ["A", "B"]
        value = [valueA, valueB]
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": [dimension, series, value]
        }
    elif chart_type == 'pie':
        dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        value = [round(random.uniform(50, 150), 2) for _ in dimension]
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": [dimension, value]
        }
    elif chart_type == 'radar':
        dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        value = [round(random.uniform(50, 150), 2) for _ in dimension]
        valueMax = [150 for _ in dimension]
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": [dimension, valueMax, value]
        }
    elif chart_type == 'surface':
        start, stop, step = -10, 10, 1
        xRange = [start + i * step for i in range(int(math.ceil((stop - start) / step)))]
        yRange = [start + i * step for i in range(int(math.ceil((stop - start) / step)))]
        zValues = [[x,y,3*x*x+y+random.uniform(0,1)*50] for x in xRange for y in yRange]
        axis = ["moneyness", "dte", "vega"]
        shape = [len(xRange), len(yRange)]
        return {
            "id": datetime.now().strftime("%Y%m%d%H%M%S%f"),
            "timestamp": datetime.now().isoformat(),
            "value": [axis, shape, zValues]
        }
    else:
        return None

# --- Websockets Handler ---

async def websocket_handler(websocket, path):
    client_address = f"{websocket.remote_address[0]}:{websocket.remote_address[1]}"
    logging.info(f"New client connected: {client_address} on path {route}")
    
    if route and path != route:
        logging.warning(f"Invalid subscription request from '{client_address}': chart_type='{chart_type}', key_word='{key_word}'. Connection attempt on invalid path: {path}. Expected: {route}")
        await websocket.send(json.dumps({"status": "failure", "message": "Connection attempt on invalid route path."}))
        await websocket.close(code=1008, reason="Connection attempt on invalid route path.")
        return
    
    try:
        # Accept Subscription
        subscription_message_raw = await websocket.recv()
        subscription_message = json.loads(subscription_message_raw)
        
        chart_type = subscription_message.get("chart_type")
        key_word = subscription_message.get("key_word")

        # Check chart_type and key_word
        data_check = await generate_data(chart_type, key_word)
        if not chart_type or not key_word or data_check is None:
            logging.warning(f"Invalid subscription request from '{client_address}': chart_type='{chart_type}', key_word='{key_word}'.")
            
            # send fail info and close connection
            await websocket.send(json.dumps({"status": "failure", "message": "Invalid chart type or keyword."}))
            await websocket.close(code=1008, reason="Invalid subscription format.")
            return
        
        # Success of subscription, send info
        await websocket.send(json.dumps({"status": "success", "message": "Subscription successful."}))
        logging.info(f"Client '{client_address}' subscribing to: chart_type='{chart_type}', key_word='{key_word}'")
        
        # Loop to send data
        while True:
            data = await generate_data(chart_type, key_word)
            if data:
                await websocket.send(json.dumps(data))
                
            # Send data 4 times per second
            await asyncio.sleep(0.25)

    # Catch Exception
    except ConnectionClosedOK:
        logging.info(f"Client disconnected gracefully: {client_address}")
    except ConnectionClosedError as e:
        # Client broken with exception
        logging.info(f"Client disconnected unexpectedly: {client_address} - {e}")
    except json.JSONDecodeError:
        logging.error(f"Received malformed JSON from client: {client_address}")
    except Exception as e:
        logging.error(f"An unexpected error occurred with client {client_address}: {e}")

# --- Websockets Server Setup ---

async def main():
    logging.info("Starting up...")
    
    # websockets.serve will pass 'websocket' and 'path' to websocket_handler
    async with websockets.serve(
        websocket_handler, 
        host, 
        port, 
    ):
        logging.info(f"Websocket Server running on ws://{host}:{port}{route}")
        # run untill keyboard Interrupt
        await asyncio.Future() 

    logging.info("Shutting down...")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server stopped by user (Ctrl+C).")
