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
          high: value,
          low: value,
          open: value,
          close: value,
          sum: value,
          adverage: value,
          volume: 1
        }
        this.serie.push(currentCandleStick)
        currentPeriod = period
      }else{
        currentCandleStick.low = Math.min(currentCandleStick.low, value)
        currentCandleStick.high = Math.max(currentCandleStick.high, value)
        currentCandleStick.close = value
        currentCandleStick.sum += value
        currentCandleStick.volume ++
        currentCandleStick.adverage = value / currentCandleStick.volume
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
      high: this.extract("high"),
      low: this.extract("low"),
      close: this.extract("close")
    })
  }

  atr(period){
    return TI.Stochastic.calculate({
      period: period,
      high: this.extract("high"),
      low: this.extract("low"),
      close: this.extract("close")
    })
  }

}

module.export = ClandleStickSeries
