#!/usr/bin/python
#coding = utf-8
import eel
import os
import logging

from .configEdit import configLoad

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

config = configLoad()

APP_CONFIG = config['APP_CONFIG']

EEL_CONFIG = config['EEL_CONFIG']

@eel.expose
def get_initial_config():
    logging.info("Initializing...")
    return APP_CONFIG

def run():
    if os.environ.get('EEL_DEVELOPMENT_MODE') == 'true':
        port = EEL_CONFIG['PORT_DEV']
        logging.info(f"Running in Development Mode, Port: {port}")
        eel.init('')
        eel.start('', mode=None, port=port, host='localhost')
    else:
        port = EEL_CONFIG['PORT']
        size = tuple(EEL_CONFIG['SIZE'])
        eel.init(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web'))
        eel.start('index.html', size=size, mode='default', port=port)

def simulate():
    from .apiTest import simulateAll
    simulateAll()

def test():
    from time import sleep
    from threading import Thread

    def thread_target(func, *func_args, **func_kwargs):
        try:
            func(*func_args, **func_kwargs)
        except Exception as e:
            logging.error(f"Error in background thread: {e}")
        finally:
            logging.info(f"Thread finished.")

    front = Thread(target=run, daemon=True)
    front.start()
    backend = Thread(target=simulate, daemon=True)
    backend.start()

    try:
        logging.info('Running test...')
        sleep(300)
    except KeyboardInterrupt:
        logging.info("Test terminated.")

