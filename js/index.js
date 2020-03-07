import { createElement,createAnimation } from './shared/util.js';
import { requestWeatherDays } from './shared/api.js';
import { requestWeatherHours } from './shared/api.js';

// 获取省和市输入框的DOM元素
const provinceElement = document.querySelector("#province");
const cityElement = document.querySelector("#city");

async function handleFetchWeather() {
  const data = await requestWeatherDays(provinceElement.value,cityElement.value);


  var NewOpt={
    tooltip: {
      trigger: 'axis',
    },
    title:{
      text:'每日天气'
    },
    legend: {
      data:['最高气温','最低气温']
    },
    xAxis: {
      axisTick: {
        alignWithLabel: true
      },
      name:"日期",
      data:[]
    },
    yAxis: {
      name:"℃",
      type:'value'
    },
    series: []
  };
  var Ser_Max={
    name: '最高气温',
    type: 'line',
    smooth:true,
    symbolSize:40,
    data: []
  };
  var Ser_Min={
    name: '最低气温',
    type: 'line',
    smooth:true,
    symbolSize:13,
    data: []
  };
  Object.values(data.data.forecast_24h).forEach((item, index) => {
    NewOpt.xAxis.data.push(item.time);
    Ser_Max.data.push(
        {
          weather:item.day_weather,
          symbol:"image://img/"+item.day_weather_code+".png",
          value:item.max_degree
        }
    );
    Ser_Min.data.push(item.min_degree);
  });
  NewOpt.series.push(Ser_Max);
  NewOpt.series.push(Ser_Min);
  var myChart = echarts.init(document.getElementById('speedChartMain'));
  myChart.setOption(NewOpt, true);
}
async function handleFetchWeather2() {
  const data = await requestWeatherHours(provinceElement.value,cityElement.value);
  var NewOpt={
    tooltip: {
      trigger: 'axis',
      formatter(params){
        return "时间:"+params[0].data.time+"<br/>气温:"+params[0].data.value+"℃<br/>天气:"+params[0].data.weather+"<br/>code:"+params[0].data.code;
      }
    },
    title:{
      text:'小时天气跟踪'
    },
    legend: {
      data:['气温']
    },
    xAxis: {
      axisTick: {
        alignWithLabel: true
      },
      name:"时间",
      data:[]
    },
    yAxis: {
      name:"℃",
      type:'value'
    },
    series: []
  };
  var Ser={
    name: '气温',
    type: 'line',
    smooth:true,
    symbolSize:40,
    data: []
  };
  Object.values(data.data.forecast_1h).forEach((item, index) => {
    NewOpt.xAxis.data.push(item.update_time);
    Ser.data.push(
        {
          time:item.update_time,
          weather:item.weather,
          code:item.weather_code,
          symbol:"image://img/"+item.weather_code+".png",
          value:item.degree
        }
    );
  });
  NewOpt.series.push(Ser);
  var myChart = echarts.init(document.getElementById('speedChartMain'));
  myChart.setOption(NewOpt, true);
}

document.querySelector("#btn_query").addEventListener("click", handleFetchWeather);
document.querySelector("#btn_query2").addEventListener("click", handleFetchWeather2);