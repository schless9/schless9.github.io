let response_count = 0;

// These are colors from chart.js utils
    const Super_Sectors = {
      "00":	'Total nonfarm',
      "05":	'Total private',
      "06":	'Goods-producing',
      "07":	'Service-providing',
      /*
      "08": 'Private service-providing',
      "10":	'Mining and logging',
      "20":	'Construction',
      "30":	'Manufacturing',
      "31":	'Durable Goods',
      "32":	'Nondurable Goods',
      "40":	'Trade, transportation, and utilities',
      "41":	'Wholesale trade',
      "42":	'Retail trade',
      "43":	'Transportation and warehousing',
      "44": 'Utilities',
      "50":	'Information',
      "55":	'Financial activities',
      "60":	'Professional and business services',
      "65":	'Education and health services',
      "70":	'Leisure and hospitality',
      "80":	'Other services',
      "90":	'Government'
      */
    }
    let supersector_keys = Object.keys (Super_Sectors) 
    const CHART_COLORS = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)',
      black: 'rgb(0, 0, 0)'
    };
    let chart_color_keys = Object.keys (CHART_COLORS)
//    console.dir(CHART_COLORS);

    const CHART_COLORS_50_Percent = {
      red: 'rgba(255, 99, 132, 0.5)',
      orange: 'rgba(255, 159, 64, 0.5)',
      yellow: 'rgba(255, 205, 86, 0.5)',
      green: 'rgba(75, 192, 192, 0.5)',
      blue: 'rgba(54, 162, 235, 0.5)',
      purple: 'rgba(153, 102, 255, 0.5)',
      grey: 'rgba(201, 203, 207, 0.5)',
      black: 'rgba(0, 0, 0, 0.5)'
    };
//    console.log(CHART_COLORS_50_Percent);
//    end utils

    const data = {
      labels: [],
      datasets: []
    }

  //  console.dir(data);

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Number of Employees in Thousands'
          }
        }
      }
    };
//    console.log(config);
//    console.dir(myChart);
//    console.log("Ending");
function responseReceivedHandler(){
  let gridline = {
    label: '',
    data: [],
    borderColor: CHART_COLORS.red,
    backgroundColor: CHART_COLORS_50_Percent.red,
    hidden: true
  };
  if(this.status == 200){
    console.log (this.response)
    let dataArray = this.response.Results.series[0].data;
    let seriesID = this.response.Results.series[0].seriesID
    let sector_code = seriesID.substring (3,5)
    for (let i = dataArray.length - 1; i >= 0; i--) {
      gridline.data.push (dataArray[i].value)
      if (response_count == 0) {
      data.labels.push(dataArray[i].periodName + " " + dataArray[i].year)
      }
    }
    gridline.label = Super_Sectors[sector_code]
    gridline.borderColor = CHART_COLORS[chart_color_keys[response_count]]
    gridline.backgroundColor = CHART_COLORS_50_Percent[chart_color_keys[response_count]]
    data.datasets.push(gridline)
    response_count++
    if (response_count == supersector_keys.length) {
    const myChart = new Chart(
      document.getElementById('myChart'),
        config);
    }
  } else {
    console.log ("error");
  }
}
for (let i= 0; i<supersector_keys.length; i++) {
let xhr = new XMLHttpRequest();
xhr.responseType = "json"
xhr.addEventListener("load", responseReceivedHandler);

let start_query = "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU"
let end_query = "00000001?registrationkey=df39b7dfad9948b681a49ce499bcd0c7"
xhr.open("GET", start_query + supersector_keys[i] + end_query);
xhr.send();
}
