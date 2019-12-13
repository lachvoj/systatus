#!/usr/bin/python3.6

import copy
import json
import psutil
from psutil._common import bytes2human

data = {}
data['temperatures'] = {}
for tmp, vals in psutil.sensors_temperatures().items():
    data['temperatures'][tmp] = []
    for i, val in enumerate(vals):
         data['temperatures'][tmp].append({})
         for j, item in enumerate(val):
             data['temperatures'][tmp][i][val._fields[j]] = item

data['memory'] = {}
vm = psutil.virtual_memory()
for i, value in enumerate(vm):
    data['memory'][vm._fields[i]] = value

print(json.dumps(data))
