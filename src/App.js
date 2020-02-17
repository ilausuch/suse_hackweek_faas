import React from 'react';
import logo from './logo.svg';
import data from './data.json';
import moment from 'moment'
import './App.css';
import CandlestickSeries from './libs/CandlestickSeries.js'
import GoogleDriver from './libs/GoogleDriver.js'
import SmeltProcessor from './libs/SmeltProcessor.js'

import { render } from "react-dom";
import { Chart } from "react-google-charts";
const axios = require('axios');

const studyOptions = [
  "duration",
  "complexity",
  "delayToBeAssigned",
  "delayToBeAssigned_assignements",
  "delayToBeAssigned_bugs",
  "delayToBeAssigned_complexity",
  "delayToBeAssigned_size",
  "delayToBeAssigned_size_complexity",
  "delayToBeAssigned_totalTime",
  "delayToSolve",
  "delayToSolve_assignements",
  "delayToSolve_bugs",
  "delayToSolve_complexity",
  "delayToSolve_delayToBeAssigned",
  "delayToSolve_size",
  "delayToSolve_size_complexity",
  "delayToSolve_totalTime",
  "numberOfBugs",
  "numberBugs_size",
  "numberOfPlatforms",
  "passed",
  "size",
  "totalTime",
  "totalTime_assignements",
  "totalTime_bugs",
  "totalTime_complexity",
  "totalTime_size",
  "totalTime_size_complexity",

]

const fieldOptions=[
  "adverage",
  "sum",
  "high",
  "low",
  "volume"
]

class App extends React.Component {
  state = {
    study: "totalTime",
    field: "sum",
    fp: 14,
    sp: 40,
    ssp: 100,
    filter_totaltime: "on",
    filter_passed: "on",
    filter_no_passed: undefined,
    from: undefined,
    to: undefined
  }

  constructor(props){
    super(props)

    this.smeltProcessor = new SmeltProcessor(data);
    this.events = this.smeltProcessor.process()
    console.log(this.events)
  }
  // let events = [];
  //
  // var previous = 1000;
  // for (var i=0;i<200;i++){
  //   var date = moment().subtract(30 - i, 'days')
  //   for(var j=0; j<10; j++){
  //     previous = previous + Math.round((Math.random()*100)) - 50
  //     events.push({
  //       date: date,
  //       active: previous
  //     })
  //   }
  // }
  changeStudy(event) {
    this.setState({study: event.target.value});
  }

  changeField(event) {
    this.setState({field: event.target.value});
  }

  changeFrom(event){
    this.setState({from: event.target.value})
  }

  changeTo(event){
    this.setState({to: event.target.value})
  }

  changeFilter(event, filter){
    var change = {}
    if (this.state[filter] == "on")
      change[filter] = undefined
    else
      change[filter] = "on"

    console.log(change)
    this.setState(change)
    console.log(this.state)
  }

  render(){
    var compression = 1
    let { study, field, fp, sp, ssp,
        filter_totaltime, filter_passed, filter_no_passed,
        from, to
    } = this.state;



    var ti = new CandlestickSeries()
    var serie = ti.process(this.events, "date", study, 1, (item) => {
      return (filter_totaltime !== "on" || item.totalTime > 0) &&
        (filter_passed !== "on" || item.passed !== 1)
    })

    let fromOptions = []
    let toOptions = []

    serie.forEach((item)=>{
      // fromOptions.push({label:moment(item.period,"YYYYMMDD").format("MM-DD-YYYY"), value:item.period})
      // if (from !== undefined || item.period >= from)
      //   toOptions.push({label:moment(item.period,"YYYYMMDD").format("MM-DD-YYYY"), value:item.period})

      fromOptions.push(item.period)
      if (from === undefined || item.period >= from)
        toOptions.push(item.period)
    })

    if (from === undefined)
      from = fromOptions[0]

    if (to === undefined)
      to = fromOptions[fromOptions.length -1]

    // ti.serie = serie.filter((item) =>{
    //   return item.period >= from && item.period <= to
    // })

    var google = new GoogleDriver(ti)
    let values = google.getValueWithEmas(fp, sp, ssp, field)
    let macd = google.getMACD(fp, sp, 9, field)
    let macd2 = google.getMACD(sp, ssp, 9, field)

    values = values.filter((item) =>{
      return item[0].type || moment(item[0]).format("YYYYMMDD") >= from && moment(item[0]).format("YYYYMMDD") <= to
    })

    macd = macd.filter((item) =>{
      return item[0].type || moment(item[0]).format("YYYYMMDD") >= from && moment(item[0]).format("YYYYMMDD") <= to
    })

    macd2 = macd2.filter((item) =>{
      return item[0].type || moment(item[0]).format("YYYYMMDD") >= from && moment(item[0]).format("YYYYMMDD") <= to
    })

    return (
      <div className="App">

      <div className="container-fluid">
        <div className="row">
          <div className="col-2 menu">
            <div className="logoContainer">
              <img src="https://www.suse.com/assets/img/fn-suse-ico.png"/>
            </div>


            <div className="form-group">
              <label htmlFor="studySelector">Study</label>
              <select id="studySelector" className="form-control" value={study} onChange={e => this.changeStudy(e)}>
                {studyOptions.map(item =>
                  <option value={item} key={"studySelector_"+item}>{item}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="aggregationSelector">Aggregation mode</label>
              <select id="aggregationSelector" className="form-control"  value={field} onChange={e => this.changeField(e)}>
                {fieldOptions.map(item =>
                  <option value={item} key={"fieldSelector_"+item}>{item}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fromSelector">From</label>
              <select id="fromSelector" className="form-control" value={from} onChange={e => this.changeFrom(e)}>
                {fromOptions.map(item =>
                  <option value={item} key={"fromSelector_"+item}>{item}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="toSelector">To</label>
              <select id="toSelector" className="form-control"  value={to} onChange={e => this.changeTo(e)}>
                {toOptions.map(item =>
                  <option value={item} key={"toSelector_"+item}>{item}</option>
                )}
              </select>
            </div>

            <hr/>
            <h2>Filters</h2>

            <div className="form-group form-check">
              <input type="checkbox" className="form-check-input" id="check1"  checked={filter_totaltime} onChange={e => this.changeFilter(e, 'filter_totaltime')}/>
              <label className="form-check-label" htmlFor="check1">only totalTime &gt;0</label>
            </div>

            <div className="form-group form-check">
              <input type="checkbox" className="form-check-input" id="check3"  checked={filter_passed} onChange={e => this.changeFilter(e, 'filter_passed')}/>
              <label className="form-check-label" htmlFor="check3">only passed</label>
            </div>

            <div className="form-group form-check">
              <input type="checkbox" className="form-check-input" id="check4"  checked={filter_no_passed} onChange={e => this.changeFilter(e, 'filter_no_passed')}/>
              <label className="form-check-label" htmlFor="check4">only rejected and discarted</label>
            </div>

          </div>
          <div className="col-10">
            <div>
              <Chart
                chartType="ComboChart"
                data = {values}
                width = "100%"
                height = "400px"
                legendToggle
                // seriesType = "bars"
                // series={series}
                options={{
                  title : study,
                  seriesType: 'bars',
                  legend:'top',
                  hAxis: {
                    format: "M/yy"
                    // gridlines: {count: 15}
                  },
                  series: {
                    1: {type: 'line'},
                    2: {type: 'line'},
                    3: {type: 'line'}
                  }
                }}
              />
            </div>

            <div>
              <Chart
                chartType="ComboChart"
                data = {macd}
                width = "100%"
                height = "400px"
                legendToggle
                // seriesType = "bars"
                // series={series}
                options={{
                  title : 'MACD (fast)',
                  legend:'top',
                  seriesType: 'bars',
                  series: {
                    1: {type: 'line'}
                  },
                  hAxis: {
                    format: "M/yy",
                    textPosition: 'none'
                  },
                }}
              />
            </div>

            <div>
              <Chart
                chartType="ComboChart"
                data = {macd2}
                width = "100%"
                height = "400px"
                legendToggle
                // seriesType = "bars"
                // series={series}
                options={{
                  title : 'MACD (slow)',
                  legend:'top',
                  seriesType: 'bars',
                  series: {
                    1: {type: 'line'}
                  },
                  hAxis: {
                    format: "M/yy",
                    textPosition: 'none'
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>



      </div>
    );
  }
}

// let rsi = google.getRSI(fp, field)
// let sto = google.getSTO(100, 9, field)

// <div>
//   <Chart
//     chartType="ComboChart"
//     data = {candlesticks}
//     width = "100%"
//     height = "400px"
//     legendToggle
//     // seriesType = "bars"
//     // series={series}
//     options={{
//       title : 'Productivity',
//       seriesType: 'candlesticks',
//       legend:'top',
//       hAxis: {
//         format: "M/d/yy"
//         // gridlines: {count: 15}
//       },
//       series: {
//         0: {type: 'line'},
//         1: {type: 'line'},
//         2: {type: 'line'}},
//       candlestick: {
//         fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
//         risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
//       }
//     }}
//   />
// </div>


      // <div>
      //   <Chart
      //     chartType="ComboChart"
      //     data = {rsi}
      //     width = "100%"
      //     height = "400px"
      //     legendToggle
      //     // seriesType = "bars"
      //     // series={series}
      //     options={{
      //       title : 'RSI',
      //       legend:'top',
      //       seriesType: 'line',
      //       series: {
      //         1: {type: 'line'},
      //         2: {type: 'line'}
      //       },
      //       hAxis: {
      //         format: "M/yy",
      //         textPosition: 'none'
      //       },
      //     }}
      //   />
      // </div>
      // <div>
      //   <Chart
      //     chartType="ComboChart"
      //     data = {sto}
      //     width = "100%"
      //     height = "400px"
      //     legendToggle
      //     // seriesType = "bars"
      //     // series={series}
      //     options={{
      //       title : 'Stochastic',
      //       legend:'top',
      //       seriesType: 'line',
      //       series: {
      //         1: {type: 'line'},
      //         2: {type: 'line'}
      //       },
      //       hAxis: {
      //         format: "M/yy",
      //         textPosition: 'none'
      //       },
      //     }}
      //   />
      // </div>
export default App;
