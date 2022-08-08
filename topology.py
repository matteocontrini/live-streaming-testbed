from os import getcwd

import pyroute2
from comnetsemu.cli import CLI
from comnetsemu.net import Containernet, VNFManager
from mininet.link import TCLink
from mininet.log import info, setLogLevel
from mininet.node import Controller

from api import ApiServer

LINK_DEFAULT_BANDWIDTH = 10
LINK_DEFAULT_DELAY = '15ms'


def create_topology():
    net = Containernet(controller=Controller, link=TCLink)
    mgr = VNFManager(net)

    info('*** Adding controller\n')
    net.addController('c0')

    info('*** Adding hosts\n')

    h1 = net.addDockerHost(
        'h1', dimage='dev_test', ip='10.0.0.1', docker_args={'hostname': 'h1'}
    )

    h2 = net.addDockerHost(
        'h2', dimage='dev_test', ip='10.0.0.2', docker_args={'hostname': 'h2'}
    )

    h3 = net.addDockerHost(
        'h3', dimage='dev_test', ip='10.0.0.3', docker_args={'hostname': 'h3'}
    )

    info('*** Adding switches\n')
    s1 = net.addSwitch('s1')
    s2 = net.addSwitch('s2')

    info('*** Adding links\n')
    net.addLink(h1, s1, bw=100, delay='0ms')
    link: TCLink = net.addLink(s1, s2, bw=LINK_DEFAULT_BANDWIDTH, delay=LINK_DEFAULT_DELAY)
    net.addLink(s2, h2, bw=100, delay='0ms')

    info('\n*** Starting network\n')
    net.start()

    info('*** Pinging\n')
    net.pingFull((h1, h2))

    h1.cmd(f'echo "{h2.IP()} cdn.local" >> /etc/hosts')

    # Create live video source container
    mgr.addContainer(
        'live-source', 'h3', 'live-source', None,
        docker_args={
            'volumes': {getcwd() + '/cdn/www': {'bind': '/live', 'mode': 'rw'}}
        }
    )

    # Add CDN server container
    mgr.addContainer(
        'cdn', 'h2', 'cdn', None,
        docker_args={
            'volumes': {getcwd() + '/cdn/www': {'bind': '/h2o/www', 'mode': 'ro'}}
        }
    )

    # Add client container
    mgr.addContainer(
        'client', 'h1', 'client', None,
        docker_args={
            'volumes': {getcwd() + '/client/out': {'bind': '/client/out', 'mode': 'rw'}},
        }
    )

    api_ip = pyroute2.IPRoute().get_addr(label='docker0')[0].get_attr('IFA_ADDRESS')
    port = 8080

    print(f'*** Starting the API server, listening on {api_ip}:{port}')
    server = ApiServer(link, api_ip, port)
    server.start()

    CLI(net)

    info('*** Stopping network')
    mgr.stop()
    net.stop()


if __name__ == '__main__':
    setLogLevel('info')
    create_topology()
