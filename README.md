# StreamDataPanel

## Introduction

StreamDataPanel is a local-hosted web app, which is used to show frequently-freshed data as line chart, bar chart, pie chart, radar chart, scatter chart or surface chart. It is based on eel with python, optimized for speed.

## Quick Check

To see functions of StreamDataPanel, you can firstly run a test.

Use ``testSDP`` in terminal to run a test APP. A web will be opened automatically. Type one of the following words below into ``ChartType`` input: ``line`` , ``bar`` , ``sequence`` , ``lines`` , ``bars`` , ``sequences`` , ``pie`` , ``radar`` , ``scatter`` , ``surface`` , ``area`` , ``areas``. Then type ``test`` into ``KeyWord`` input. Click ``Subscribe`` to see if it runs correctly. If You see a chart with data freshed every second, it means success.

## Quick Start

As mentioned above, the first thing is to import and start API:

    from StreamDataPanel import *
    start_api()

After it, you can choose a chart type and create an instance of it:

    line_chart = Line('this_is_a_title')

This title will be a key word when you try to subscribe this data, so **you can not have two charts which have the same chart-type and title**. It means you can not create two line charts, both have title named as ``this_is_a_title`` . However, you can create a line chart and a bar chart, both have the name ``this_is_a_title`` .

You can update data by ``fresh`` function:

    import time
    for i in range(10000):
        line_chart.fresh(i)
        time.sleep(0.25)

You should run this python script by:

    python your_script.py

Next step is to start a web app by the following command in **terminal**:

    runSDP

A web app should be started automatically, if everything is correct. Then type ``line`` into ``ChartType`` input, type ``this_is_a_title`` into ``KeyWord`` input. Click ``Subscribe`` to show your chart. You will see a line chart, which is a straight line updated 4 times per second.

## Document

You can read the document on https://streamdatapanel-doc.readthedocs.io/en/latest/index.html







