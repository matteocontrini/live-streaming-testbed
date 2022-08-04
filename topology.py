from os import getcwd
from comnetsemu.cli import CLI
from comnetsemu.net import Containernet, VNFManager
from mininet.link import TCLink
from mininet.log import info, setLogLevel
from mininet.node import Controller

def create_topology():
    net = Containernet(controller=Controller, link=TCLink)
    mgr = VNFManager(net)

    info("*** Adding controller\n")
    net.addController("c0")

    info("*** Adding hosts\n")

    h1 = net.addDockerHost(
        "h1", dimage="dev_test", ip="10.0.0.1", docker_args={"hostname": "h1"}
    )

    h2 = net.addDockerHost(
        "h2", dimage="dev_test", ip="10.0.0.2", docker_args={"hostname": "h2"}
    )

    h3 = net.addDockerHost(
        "h3", dimage="dev_test", ip="10.0.0.3", docker_args={"hostname": "h3"}
    )

    info("*** Adding switches and links\n")
    s1 = net.addSwitch("s1")
    s2 = net.addSwitch("s2")
    net.addLink(h1, s1, bw=100, delay="1ms")
    link = net.addLink(s1, s2, bw=10, delay="15ms")
    # link.intf1.config(bw=5)
    # link.intf2.config(bw=5)
    net.addLink(s2, h2, bw=100, delay="1ms")

    info("*** Starting network\n")
    net.start()

    info("*** Pinging\n")
    net.ping((h1, h2))
    
    h1.cmd(f"echo '{h2.IP()} cdn.local' >> /etc/hosts")
    
    # Create live video source container
    mgr.addContainer(
        "live-source", "h3", "live-source", None,
        docker_args={
            'volumes': {getcwd() + '/cdn/www': {'bind': '/live', 'mode': 'rw'}}
        }
    )

    # Add CDN server container
    mgr.addContainer(
        "cdn", "h2", "cdn", None,
        docker_args={
            'volumes': {getcwd() + '/cdn/www': {'bind': '/h2o/www', 'mode': 'ro'}}
        }
    )

    # Add client container
    mgr.addContainer(
        "client", "h1", "client", None,
        docker_args={
            'volumes': {getcwd() + '/client/out': {'bind': '/out', 'mode': 'rw'}},
        }
    )

    CLI(net)

    info("*** Stopping network")
    mgr.stop()
    net.stop()


if __name__ == "__main__":
    setLogLevel("info")
    create_topology()
