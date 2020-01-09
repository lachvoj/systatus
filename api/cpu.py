#!/usr/bin/python3.6

import json
import psutil
import os
import re

data = {}
data['cpu'] = {}

data['cpu']['count'] = psutil.cpu_count(logical=False)
data['cpu']['countLogial'] = psutil.cpu_count(logical=True)

data['cpu']['percent'] = psutil.cpu_percent(interval=0.3, percpu=True)

temperatures = psutil.sensors_temperatures()
if hasattr(temperatures, 'coretemp'):
    data['cpu']['temperature'] = []
    for val in psutil.sensors_temperatures()['coretemp']:
        data['cpu']['temperature'].append(val.current)

data['cpu']['times'] = {}
timesOutput = re.sub(r'([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\s*(PM|AM)*\s*', '', os.popen('mpstat -P ALL').read())
timesOutput = re.sub(r'[%]', '', timesOutput)
timesOutput = re.sub(r'[ ]+', ' ', timesOutput).split('\n')
del timesOutput[:2]
timesOutput.pop()
for i, val in enumerate(timesOutput):
    timesOutput[i] = timesOutput[i].split(' ')

data['cpu']['times']['header'] = timesOutput[0] 

data['cpu']['times']['data'] = {}
for i in range(1, len(timesOutput)):
    data['cpu']['times']['data'][timesOutput[i][0]] = []
    for j in range(1, len(timesOutput[0])):
        data['cpu']['times']['data'][timesOutput[i][0]].append(float(timesOutput[i][j]))

print(json.dumps(data))
