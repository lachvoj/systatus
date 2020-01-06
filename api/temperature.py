#!/usr/bin/python3.6

import copy
import json
import psutil

data = {}
data['temperature'] = {}
for tmp, vals in psutil.sensors_temperatures().items():
    data['temperature'][tmp] = []
    for i, val in enumerate(vals):
         data['temperature'][tmp].append({})
         for j, item in enumerate(val):
             data['temperature'][tmp][i][val._fields[j]] = item

print(json.dumps(data))
