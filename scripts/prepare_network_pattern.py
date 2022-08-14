import csv
from os import path

INPUT_DIR = '.'
OUT_DIR = '../client/src/assets/patterns'


def convert(pattern):
    input = path.join(INPUT_DIR, pattern['input'])
    output = path.join(OUT_DIR, pattern['output'])
    with open(input, 'r') as f, \
            open(output, 'w') as out:
        reader = csv.DictReader(f)
        writer = csv.DictWriter(out, ['network', 'dl', 'ul', 'rtt', 'loss'])
        writer.writeheader()
        i = 1
        for row in reader:
            if pattern['range'][0] <= i <= pattern['range'][1]:
                writer.writerow({
                    'network': row['NetworkMode'],
                    'dl': float(row['DL_bitrate']) / 1000,
                    'ul': float(row['UL_bitrate']) / 1000,
                    'rtt': 80,
                    'loss': 0
                })
            i += 1


def main():
    # https://www.ucc.ie/en/misl/research/datasets/ivid_4g_lte_dataset/
    patterns = [
        {
            'input': 'A_2018.02.05_13.35.50.csv',
            'output': 'lte.csv',
            'range': [1, 61]
        },
        {
            'input': 'B_2018.01.17_15.56.48.csv',
            'output': 'hspa+.csv',
            'range': [541, 601]
        }
    ]

    for pattern in patterns:
        convert(pattern)


if __name__ == '__main__':
    main()
