import moment from 'moment'
export default class GoogleDriver{
  constructor(ti){
    this.ti = ti
  }

  convertPeriodToDate(period){
    return moment(period, "YYYYMMDD").toDate()
  }

  convertPeriodListToDate(list){
    var result=[]
    list.forEach((item)=>{
      result.push(this.convertPeriodToDate(item))
    })
    return result
  }

  getCandlesticks(){
    var values=[]

    values.push([
      {
        // type: "date",
        type: "date",
        id: "Date"
      },
      {
        type: "number",
        label: "low"
      },
      {
        type: "number",
        label: "open"
      },
      {
        type: "number",
        label: "close"
      },
      {
        type: "number",
        label: "high"
      }
    ])

    this.ti.serie.forEach((item)=>{
      var element = []
      element.push(item.period)
      element.push(item.low)
      element.push(item.open)
      element.push(item.close)
      element.push(item.high)

      values.push(element)
    })

    return values
  }

  get3emas(fastPeriod, slowPeriod, superSlowPeriod){
    var fema = this.ti.ema(fastPeriod)
    var sema = this.ti.ema(slowPeriod)
    var ssema = this.ti.ema(superSlowPeriod)
    var periods = this.ti.extract("period")

    var output=[["period","fast","slow","superslow"]]

    for(var i=0; i<periods.length; i++){
      var row=[]
      row.push(periods[i])
      row.push(fema[i])
      row.push(sema[i])
      row.push(ssema[i])
      output.push(row)
    }

    console.log(output)
    return output
  }

  getCandlesticksWithEmas(fastPeriod, slowPeriod, superSlowPeriod){
    var candlesticks = this.getCandlesticks()
    var fema = this.ti.ema(fastPeriod)
    var sema = this.ti.ema(slowPeriod)
    var ssema = this.ti.ema(superSlowPeriod)
    var data=[[
      candlesticks[0][0],
      {
        type: "number",
        label: "Fast EMA"
      },{
        type: "number",
        label: "Slow EMA"
      },
      {
        type: "number",
        label: "Super Slow EMA"
      },
      candlesticks[0][1],
      candlesticks[0][2],
      candlesticks[0][3],
      candlesticks[0][4]
    ]]

    for(var i=1; i<candlesticks.length; i++){
      data.push([
        this.convertPeriodToDate(candlesticks[i][0]),
        fema[i],
        sema[i],
        ssema[i],
        candlesticks[i][1],
        candlesticks[i][2],
        candlesticks[i][3],
        candlesticks[i][4]
      ])
    }

    console.log(data)

    return data
  }

  getValueWithEmas(fastPeriod, slowPeriod, superSlowPeriod, field = "adverage"){

    var periods = this.ti.extract("period")
    var values = this.ti.extract(field)
    var fema = this.ti.ema(fastPeriod, field)
    var sema = this.ti.ema(slowPeriod, field)
    var ssema = this.ti.ema(superSlowPeriod, field)
    var data=[[
      {
        type: "date",
        id: "Date"
      },
      {
        type: "number",
        label: field
      },
      {
        type: "number",
        label: "Fast EMA"
      },{
        type: "number",
        label: "Slow EMA"
      },
      {
        type: "number",
        label: "Super Slow EMA"
      }
    ]]

    for(var i=1; i<values.length; i++){
      data.push([
        this.convertPeriodToDate(periods[i]),
        values[i],
        fema[i],
        sema[i],
        ssema[i]
      ])
    }

    console.log("*", data)
    return data
  }

  getMACD(fastPeriod, slowPeriod, signalPeriod, field){
    var values = this.ti.macd(fastPeriod, slowPeriod, signalPeriod, field)
    var data =[[
      {
        type: "date",
        id: "Date"
      },
      {
        type: "number",
        label: "macd"
      },
      {
        type: "number",
        label: "signal"
      }
    ]]

    var periods = this.ti.extract("period")
    var diff = periods.length-values.length

    periods.forEach((period, i)=>{
      var macd = undefined
      var signal = undefined

      if (i >= diff){
        macd = values[i-diff].MACD
        signal = values[i-diff].signal
      }

      data.push([
        this.convertPeriodToDate(period),
        macd,
        signal
      ])
    })


    console.log(data)
    return data
  }

  getRSI(period, field="close"){
    var values = this.ti.rsi(period, field)
    var data =[[
      {
        type: "string",
        id: "Date"
      },
      {
        type: "number",
        label: "rsi"
      },
      {
        type: "number",
        label: "upperBand"
      },
      {
        type: "number",
        label: "lowerBand"
      }
    ]]

    var periods = this.ti.extract("period")
    var diff = periods.length-values.length
    console.log(values)
    periods.forEach((period, i)=>{
      var rsi = undefined

      if (i >= diff){
        rsi = values[i-diff]
      }

      data.push([
        this.convertPeriodToDate(period),
        rsi,
        80,
        20
      ])
    })


    console.log(data)
    return data
  }

  getSTO(period, signal=9, field="close"){
    var values = this.ti.sto(period, signal, field)
    var data =[[
      {
        type: "date",
        id: "Date"
      },
      {
        type: "number",
        label: "rsi"
      },
      {
        type: "number",
        label: "signal"
      },
      {
        type: "number",
        label: "upperBand"
      },
      {
        type: "number",
        label: "lowerBand"
      }
    ]]

    var periods = this.ti.extract("period")
    var diff = periods.length-values.length
    console.log(values)
    periods.forEach((period, i)=>{
      var sto = undefined
      var signal = undefined

      if (i >= diff){
        sto = values[i-diff].k
        signal = values[i-diff].d
      }

      data.push([
        this.convertPeriodToDate(period),
        sto,
        signal,
        80,
        20
      ])
    })


    console.log(data)
    return data
  }
}
