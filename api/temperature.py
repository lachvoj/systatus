#!/usr/bin/python3.6

import copy
import json
import psutil

data = {}
data['temperatures'] = {}
for tmp, vals in psutil.sensors_temperatures().items():
    data['temperatures'][tmp] = []
    for i, val in enumerate(vals):
         data['temperatures'][tmp].append({})
         for j, item in enumerate(val):
             data['temperatures'][tmp][i][val._fields[j]] = item

print(json.dumps(data))
