import threading

from bottle import request, Bottle
from mininet.link import TCLink


class ApiServer:
    def __init__(self, link: TCLink, ip: str, port: int):
        self.ip = ip
        self.port = port
        self.link = link
        self.app = self.create_app()

    def create_app(self) -> Bottle:
        app = Bottle()
        app.route('/update', 'POST', self.update_link_config)
        return app

    def start(self):
        args = {
            'host': self.ip,
            'port': self.port,
            'quiet': True
        }
        threading.Thread(target=self.app.run, kwargs=args, daemon=True).start()

    def update_link_config(self):
        bw = request.json.get('bw')
        delay = request.json.get('delay')
        loss = request.json.get('loss')
        print(f'\n*** Setting bandwidth={bw} delay={delay} loss={loss}')
        self.link.intf1.config(bw=bw, delay=delay, loss=loss)
        self.link.intf2.config(bw=bw, delay=delay, loss=loss)
        return 'OK'
