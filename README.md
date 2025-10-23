# StreamDataPanel

## Introduction

StreamDataPanel is a local-hosted web app, which is used to show frequently-freshed data as line chart, bar chart, pie chart, radar chart, scatter chart or surface chart. It is based on eel with python, optimized for speed.

## Why Another Plot Library

The first reason is that most ploting libraries in python focus on static data. It could be difficult to show data which can be **freshed every second**. StreamDataPanel supplies a method to present it.

The second reason is StreamDataPanel is designed to **asynchronously transmit data**. A chart can be subscribed with its data updated twice per second, while another chart can be updated 10 times per second. They won't influence each other. And you can open as many browser tabs as you want, or subscribe a same chart as many times as you want.

The third reason is that you can design your own data monitor panel with StreamDataPanel. Every chart in StreamDataPanel can be **dragged to resize or re-locate**. Your design can be saved into local disk, and re-upload to StreamDataPanel next time you want to use it.

The fourth reason is that StreamDataPanel provides a **user-friendly API**, making it easier to show your data. You do not need to worry about the form of axis tickers or axis value ranges, etc. All you need to do is to give a key word as title of a chart, and pass your data to API, fresh it any time you want.

## Install

Use ``pip install StreamDataPanel`` to install.

## Usage

There are two parts in StreamDataPanel, a **Web App** and a **Data Server**. 

Web App can only be setted or started by **terminal command**. It is a data consumer, used to handle subscription from users.

Data Server can only be setted or started by **python scripts**. It is a data producer, used to provide frequently updated data.

It is highly suggested that Data Server is started before Web App, because data may takes some time to be prepared when initializing.

### Quick Check

To see functions of StreamDataPanel, you can firstly run a test.

Use ``testSDP`` in terminal to run a test APP. A web will be opened automatically. Type one of the following words below into ``ChartType`` input: ``line`` , ``bar`` , ``sequence`` , ``lines`` , ``bars`` , ``sequences`` , ``pie`` , ``radar`` , ``scatter`` , ``surface`` , ``area`` , ``areas``. Then type ``test`` into ``KeyWord`` input. Click ``Subscribe`` to see if it runs correctly. If You see a chart with data freshed every second, it means success.

### Web APP

It can only be setted or started by terminal command.

#### runSDP

Use ``runSDP`` to start it. A web should be started automatically.

#### testSDP

Use ``testSDP`` to run a simple test.

#### showSDP

Use ``showSDP`` to print current config. It is a json file with 2 layers.

#### setSDP

Use ``setSDP key_layer_1 key_layer_2 value`` to set config value.

#### resetSDP

Use ``resetSDP`` to reset config content to default value.

#### title

Once a web is opened, you can double click the title of your web to enter into edit mode. You can rename the page, click elsewhere to quit edit mode.

#### button

Once a web is opened, you will find three buttons at the top. The first one is to change theme. The second icon is to download your config, which is your theme, title and subscribed charts. The third button is to upload a config json file to refresh the whole page.

### Data Server

Data server is base on python. You have to import StreamDataPanel to start a data sever to provide your data to web app.

#### Import

It is easy to import StreamDataPanel, just as every python library you use:

    from StreamDataPanel import *

**The most important thing that needs to be noticed is that API must be actived manually before calling any chart type class:**

    start_api()

If you see the following, then API is started successfully:

    INFO:root:Initializing user API.
    INFO:StreamDataPanel.apiCore:WebsocketManager started in background thread.
    INFO:root:User API initialized.

#### Chart Type Class

There are basically two kinds of charts in StreamDataPanel, time-series charts and shortcut chart. Both of them can be updated frequently. Time-series chart will cache up to 100 data points to plot a time-series chart. The x-axis of it will be time. Shortcut chart will only keep the latest data point and to show it. The type of axises of shortcut chart can vary from one to another.

##### Line, Bar, Sequence

This is the most basic type of charts. To use it, just create a instance:

    line_chart = Line('line_chart_title')
    bar_chart = Bar('bar_chart_title')
    sequence_chart = Sequence('sequence_chart_title')

Once you have declare your instance, you can subcribe your chart, by typing ``line`` into ``ChartType`` , and typing ``line_chart_title`` into ``KeyWord`` , then click ``Subscribe`` .

To push your data to web app, just use ``fresh`` function:

    line_chart.fresh(101.5)
    bar_chart.fresh(103.9)
    sequence_chart.fresh(19.2)

**Notice: You can only pass a number to fresh function of Line, Bar and Sequence.**

Every time you call ``fresh`` , a single data will be pushed to web app. Normally, you should start a loop to update your data one by one.

If everything works, you should see your data appears in your web app.

##### Lines, Bars, Sequences

If you have multi-series data, and want to show them at the same time. These are what you need.

The difference between Sequences and Lines is that the x-axis of Sequence or Sequences has a type as time, while Line and Lines are typed as string.

To initialize an instance:

    sequences_chart = Sequences('sequences_chart_title')

To update a data:

    sequences_chart.fresh({'A':10.5, 'B':12.7})

**Notice: You have to pass a dict, whose keys are string and values are number, to the fresh function of Lines, Bars, Sequences.**

##### Scatter

It has the same applying procedure as above. The difference is data form. To update a scatter chart, you need to pass a coordinate to ``fresh`` function:

    scatter_chart.fresh([1.2, 3.8])

This coordinate must be a list with 2 elements, which are numbers.

##### Area, Pie

Area is a special kind of chart, it is like line chart, but it will not be a time-series. Area chart has a x-axis whose type is string, and will only show the latest updated data point.

To update a area chart, you have to pass a list to ``fresh`` function, which has 2 elements. The first element should be dimension, it will be used as x-axis tickers. The second element should be numbers, representing the value at given tickers:

    dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    value = [4.1, 1.23, 5.19, 8.24, 4.89, 9.24, 4.90]
    area_chart.fresh([dimension, value])

**Notice: The length of value should be the same as dimension.**

Pie chart has the same data-form request as area chart. It will only keep and show the latest updated point. To update a pie chart, use:

    pie_chart.fresh([dimension, value])

##### Areas

If you have multiple data series, and want to show the latest state of them, areas will be what you need.

To update an areas chart, you have to pass a three-element list to ``fresh`` function.

The first element should be dimension, which is like the one in area or pie chart.

The second element should be a string list, which is the name of data series.

The third element should be a list, whose element is also a number list.

An example is as follows:

    dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    series = ["A", "B"]
    valueA = [4.1, 1.23, 5.19, 8.24, 4.89, 9.24, 4.90]
    valueB = [1.1, 9.23, 8.19, 4.24, 2.89, 7.24, 3.90]
    value = [valueA, valueB]
    areas_chart.fresh([dimension, series, value])

##### Radar

Radar chart will request a data form as a three-element list.

The first one should be dimension, just as mentioned above.

The second one should be the max value of dimensions. It is a list whose elements are numbers.

The third one should be the value at different dimensions. It is a number list, too.

An example is as follows:

    dimension = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    valueMax = [10, 10, 10, 10, 10, 10, 10]
    value = [4.1, 1.23, 5.19, 8.24, 4.89, 9.24, 4.90]
    radar_chart.fresh([dimension, valueMax, value])

##### Surface

Surface is a 3D surface chart. It requires a complicated data form. You should pass a three-element list to ``fresh`` function.

The first element is a string list, whose length must be three. It is the name of x-axis, y-axis, z-axis.

The second element is an int list, whose length must be two. It is the shape of your value array, like \[number of rows, number of columns\].

The third element is the value you want to show. However, it is different as the ordinary rows-columns form. It is a stacked form of your array, like : \[\[x1, y1, z1\], \[x2, y2, z2\], ...\]

An example is as follows:

    xRange = [ -1, 1, 3]
    yRange = [-1, 1, 3]
    zValues = [[-1, -1, 1], [-1, 1, -1], [-1, 3, -3], [1, -1, -1], [1, 1, 1], [1, 3, 3], [3, -1, -3], [3, 1, 3], [3, 3, 9]]
    axis = ["X", "Y", "Z"]
    shape = [len(xRange), len(yRange)]
    surface_chart.fresh([axis, shape, zValues])







