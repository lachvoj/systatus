#!/usr/bin/python3.6

import copy
import json
import psutil
from psutil._common import bytes2human

data = {}
data["temperatures"] = psutil.sensors_temperatures()
data["memory"] = psutil.virtual_memory()

print(json.dumps(data))
