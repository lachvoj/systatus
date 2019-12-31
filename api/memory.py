#!/usr/bin/python3.6

import copy
import json
import psutil

data = {}
data['memory'] = {}
vm = psutil.virtual_memory()
for i, value in enumerate(vm):
    data['memory'][vm._fields[i]] = value

print(json.dumps(data))
