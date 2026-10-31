"""Synthetic body/year examples: common chassis must not become body-specific cohorts."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from match import Matcher

m = Matcher()
cases = [
    ('land-rover', 'freelander', 2006, 'L314', 0),
    ('land-rover', 'freelander', 2010, 'L359', 1),
    ('jaguar', 'xf', 2013, 'SPORTBRAKE', 0),
    ('jaguar', 'xf', 2019, 'SPORTBRAKE', 1),
    ('jaguar', 'xf', 2025, 'XFL', 1),
    ('jaguar', 'f-type', 2016, 'ROADSTER', 0),
    ('jaguar', 'f-type', 2016, 'COUPE', 0),
    ('jaguar', 'e-type', 1967, '2+2', 0),
    ('jaguar', 'e-type', 1970, 'ROADSTER', 1),
    ('infiniti', 'm30', 1991, 'CONVERTIBLE', 0),
    ('infiniti', 'q60', 2014, 'CONVERTIBLE', 0),
    ('infiniti', 'q60', 2020, 'CV37', 1),
    ('infiniti', 'q70', 2017, 'LONG WHEELBASE', 0),
    ('izh', '2126', 2004, '4X4', 0),
    ('izh', '2126', 2004, 'RWD', 0),
]
for make, line, year, body, want in cases:
    got = m.generation(make, line, year, body)
    assert got == want, (make, line, year, body, want, got)
print(f'PASS: {len(cases)} shared-chassis/body examples; year-only records stay at real-generation level')
