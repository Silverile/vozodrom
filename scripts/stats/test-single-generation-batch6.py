"""Parallel body/market families, complete Honda tokens and brand-specific ends."""
from match import Matcher

m = Matcher()
cases = [
    ('honda', 'acty', 1999, 'HA2', 1),
    ('honda', 'acty', 2009, 'HH5', 2),
    ('honda', 'acty', 2009, 'HA8', 3),
    ('honda', 'elysion', 2015, 'RR4', 0),
    ('honda', 'elysion', 2015, 'RC1', 1),
    ('honda', 'freed', 2024, 'GB6', 1),
    ('honda', 'freed', 2024, 'GT5', 2),
    ('honda', 'n-box', 2019, 'JF1', 0),
    ('honda', 'n-box', 2019, 'JF3', 1),
    ('honda', 'brio', 2019, 'DD2', 0),
    ('honda', 'stepwgn', 2005, 'RF4', 1),
    ('honda', 'stepwgn', 2022, 'RP2', 4),
    ('honda', 'stepwgn', 2022, 'RP7', 5),
    ('buick', 'gl8', 2022, 'SGM258', 1),
    ('buick', 'gl8', 2022, 'SGM358', 2),
    ('buick', 'gl8', 2022, 'SGM458', 3),
    ('chevrolet', 's-10', 2008, '', 1),
    ('chevrolet', 's-10', 2018, '', 2),
    ('gmc', 'sonoma', 2005, '', None),
    ('gmc', 'jimmy-s15', 2006, '', None),
    ('buick', 'skyhawk', 1980, '', None),
    ('buick', 'skyhawk', 1981, '', 1),
    ('daewoo', 'winstorm', 2012, '', None),
    ('fso', 'syrena', 1973, '', None),
    ('ginetta', 'g11', 1967, '', None),
    ('donkervoort', 'd8-gt', 2009, '', None),
    ('geely', 'vision', 2019, 'FC3', 0),
    ('changan', 'alsvin', 2015, 'V5', 0),
    ('changan', 'alsvin', 2021, '', 1),
]
for make, line, year, code, expected in cases:
    actual = m.generation(make, line, year, code)
    assert actual == expected, (make, line, year, code, actual, expected)

print(f'PASS: {len(cases)} parallel-family, intermediate chassis-token, production-gap and unknown-date cases')
