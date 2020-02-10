#!/usr/bin/python3.6

import json
import psutil
import os
import re

data = {'cpu': {}}

data['cpu']['count'] = psutil.cpu_count(logical=False)
data['cpu']['countLogial'] = psutil.cpu_count(logical=True)

temperatures = psutil.sensors_temperatures()
if 'coretemp' in temperatures:
    temperatures = psutil.sensors_temperatures()['coretemp']
    data['cpu']['temperature'] = {'data': {}, 'high': temperatures[0].high, 'critical': temperatures[0].critical}
    for (key,val) in enumerate(temperatures):
        data['cpu']['temperature']['data'][key] = val.current

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
        data['cpu']['times']['data'][timesOutput[i][0]].append(float(timesOutput[i][j].replace(',', '.')))

frequency = psutil.cpu_freq()
if hasattr(frequency, '_asdict'):
    data['cpu']['frequency'] = {'data': {}}
    allCpu = psutil.cpu_freq()
    data['cpu']['frequency']['min'] = allCpu.min
    data['cpu']['frequency']['max'] = allCpu.max
    data['cpu']['frequency']['data']['all'] = round(allCpu.current, 2)
    for (key, val) in enumerate(psutil.cpu_freq(percpu=True)):
        data['cpu']['frequency']['data'][key] = round(val.current, 2)

data['cpu']['stats'] = {}
dictStats = psutil.cpu_stats()._asdict()
for key in dictStats:
    data['cpu']['stats'][key] = dictStats[key]

data['cpu']['percent'] = {'data': {}}
for (key, val) in enumerate(psutil.cpu_percent(interval=0.2, percpu=True)):
    data['cpu']['percent']['data'][key] = val
data['cpu']['percent']['data']['all'] = psutil.cpu_percent()

print(json.dumps(data))
