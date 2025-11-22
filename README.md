# StreamDataPanel

## Introduction

StreamDataPanel is a local-hosted web app, which is used to show frequently-freshed data as line chart, bar chart, pie chart, radar chart, scatter chart or surface chart. It is based on eel with python, optimized for speed.

### Why Another Plotting Library?

Most ploting libraries in python focus on static data. It could be difficult to show data which can be **freshed every second** . StreamDataPanel supplies a method to present it.

StreamDataPanel is designed to **asynchronously transmit data** . A chart can be subscribed with its data updated twice per second, while another chart can be updated 10 times per second. They won’t influence each other. And you can open as many browser tabs as you want, or subscribe a same chart as many times as you want.

You can design your own data monitor panel with StreamDataPanel. Every chart in StreamDataPanel can be **dragged to resize or re-locate** . Your design can be saved into local disk, and re-upload to StreamDataPanel next time you want to use it.

StreamDataPanel provides a **user-friendly API** , making it easier to show your data. You do not need to worry about the form of axis tickers or axis value ranges, etc. All you need to do is to give a key word as title of a chart, and pass your data to API, fresh it any time you want.

StreamDataPanel **seperates web app with data server** . You can run your data updating process in one machine and subscribe these charts from others.

## Install

StreamDataPanel can be installed through ``pip`` , as follows:

    pip install StreamDataPanel

## Quick View

One picture is better than a thousand words:

<table width="100%">
  <tr>
    <td align="center" width="50%" >
      <img src="https://github.com/SyuyaMurakami/StreamDataPanel/raw/main/assets/1_low_res.gif" alt="GIF 1" style="width: 100%;">
    </td>
    <td align="center" width="50%" >
      <img src="https://github.com/SyuyaMurakami/StreamDataPanel/raw/main/assets/2_low_res.gif" alt="GIF 2" style="width: 100%;">
    </td>
  </tr>
</table>

## Quick Check

To see functions of StreamDataPanel, you can firstly run a test.

After installing it, use ``testSDP`` in terminal to run a test APP. A web will be opened automatically. Type one of the following words below into ``ChartType`` input: ``line`` , ``bar`` , ``sequence`` , ``lines`` , ``bars`` , ``sequences`` , ``pie`` , ``radar`` , ``scatter`` , ``surface`` , ``area`` , ``areas`` , ``gauge`` , ``text`` . Then type ``test`` into ``KeyWord`` input. Click ``Subscribe`` to see if it runs correctly. If You see a chart with data freshed every second, it means success.

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







