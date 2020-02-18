import moment from 'moment'
const TI = require('technicalindicators')

export default class ClandleStickSeries{
  constructor(){
    this.serie=[]
  }

  getPeriod(date, reductionFactor){
    var v = moment(date).format("YYYYMMDD")
    v = Math.floor(v / reductionFactor)
    switch (reductionFactor) {
      case 100:
          return v * reductionFactor + 1
        break;
      default:
        return v * reductionFactor
    }

  }

  process(eventList, dateField, valueField, reductionFactor, filter){
    var currentPeriod = this.getPeriod(eventList[0][dateField], reductionFactor)
    var currentCandleStick = undefined

    eventList.forEach((item)=>{
      var value = item[valueField]
      var period = this.getPeriod(item[dateField], reductionFactor)

      if (filter !== undefined && !filter(item, period))
        return

      if (period !== currentPeriod)
        currentCandleStick=undefined

      if (!currentCandleStick){
        currentCandleStick={
          period: period,
          max: value,
          min: value,
          open: value,
          close: value,
          accumulated: value,
          average: value,
          volume: 1,
          list: [],
          median: value
        }
        this.serie.push(currentCandleStick)
        currentPeriod = period
      }else{
        currentCandleStick.min = Math.min(currentCandleStick.min, value)
        currentCandleStick.max = Math.max(currentCandleStick.max, value)
        currentCandleStick.close = value
        currentCandleStick.accumulated += value
        currentCandleStick.volume ++
        currentCandleStick.average = value / currentCandleStick.volume
        currentCandleStick.list.push(value)
        currentCandleStick.median = currentCandleStick.list.sort()[Math.floor(currentCandleStick.list.length/2)]
      }
    })

    console.log(this.serie)

    return this.serie
  }

  extract(field){
    var values=[]

    this.serie.forEach((item)=>{
      values.push(item[field])
    })

    return values
  }

  ema(period, field="close"){
    var result = TI.EMA.calculate({period : period, values : this.extract(field)})
    for (var i=0; i<period; i++)
      result.unshift(undefined)
    return result
  }

  macd(fastPeriod, slowPeriod, signalPeriod=9, field="close"){
    return TI.MACD.calculate({
      values : this.extract(field),
      fastPeriod: fastPeriod,
      slowPeriod: slowPeriod,
      signalPeriod: signalPeriod
    });
  }

  rsi(period, field="close"){
    return TI.RSI.calculate({period : period, values : this.extract(field)})
  }

  sto(period, signalPeriod=9){
    return TI.Stochastic.calculate({
      period: period,
      signalPeriod: signalPeriod,
      max: this.extract("max"),
      min: this.extract("min"),
      close: this.extract("close")
    })
  }

  atr(period){
    return TI.Stochastic.calculate({
      period: period,
      max: this.extract("max"),
      min: this.extract("min"),
      close: this.extract("close")
    })
  }

}

module.export = ClandleStickSeries
