import csv
from os import path

# Inspire from https://github.com/twitchtv/acm-mmsys-2020-grand-challenge/blob/master/normal-network-patterns.js

OUT_DIR = '../client/src/assets/patterns'


def generate(pattern):
    output = path.join(OUT_DIR, pattern['output'])
    with open(output, 'w') as out:
        writer = csv.DictWriter(out, ['network', 'dl', 'ul', 'rtt', 'loss'])
        writer.writeheader()
        i = 1
        for phase in pattern['sequence']:
            for _ in range(phase['duration']):
                writer.writerow({
                    'dl': phase['bw'] / 1000,
                    'ul': phase['bw'] / 1000,
                    'rtt': 30,
                    'loss': 0
                })
            i += 1


def main():
    patterns = [
        {
            'output': 'cascade.csv',
            'sequence': [
                {'bw': 3800, 'duration': 10},
                {'bw': 2800, 'duration': 10},
                {'bw': 1800, 'duration': 10},
                {'bw': 1100, 'duration': 10},
            ]
        },
        {
            'output': 'spike.csv',
            'sequence': [
                {'bw': 3800, 'duration': 10},
                {'bw': 1100, 'duration': 10},
                {'bw': 2800, 'duration': 10},
            ]
        },
    ]

    for pattern in patterns:
        generate(pattern)


if __name__ == '__main__':
    main()
