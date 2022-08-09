import os
import signal
import sys
import threading

from bottle import request, Bottle
from mininet.link import TCLink
from mininet.log import info


class ApiServer:
    ip: str
    port: int
    link: TCLink
    app: Bottle
    stop: threading.Event

    def __init__(self, link: TCLink, ip: str, port: int):
        self.ip = ip
        self.port = port
        self.link = link
        self.app = self.create_app()

    def create_app(self) -> Bottle:
        app = Bottle()
        app.route('/update', 'POST', self.update_link_config)
        app.route('/stop', 'POST', self.stop)
        return app

    def start(self) -> threading.Event:
        args = {
            'host': self.ip,
            'port': self.port,
            'quiet': True
        }
        threading.Thread(target=self.app.run, kwargs=args, daemon=True).start()
        self.stop = threading.Event()
        return self.stop

    def update_link_config(self):
        bw = request.json.get('bw')
        delay = request.json.get('delay')
        loss = request.json.get('loss')
        info(f'\n*** [API] Setting bandwidth={bw} delay={delay} loss={loss}\n')
        self.link.intf1.config(bw=bw, delay=delay, loss=loss)
        self.link.intf2.config(bw=bw, delay=delay, loss=loss)
        return 'OK'

    def stop(self):
        info('\n*** [API] Stop requested\n')
        self.stop.set()
        return 'OK'
