import moment from 'moment'

export default class SmeltProcessor{
  constructor(data){
    this.raw = data
  }

  process(){
    this.data = []

    this.raw.data.forEach((item)=>{
      var delayToSolve=0
      var totalTime=0
      var assignements=0
      var delayToBeAssigned =0
      var passedNumeric = 0
      var complexity = 2
      var size = 3
      var delayToSolve_size = 0
      var numberOfBugs = item.bugs.length
      var numberOfPlatforms = item.products.length

      var date = moment(item.creation_date,"YYYY/MM/DD")

      if (item.dates && item.dates.length>0){
        delayToBeAssigned = (moment(item.dates[0],"YYYY/MM/DD, HH:mm:ss").unix() - date.unix()) / (60*60*24)
        assignements = item.dates.length
        totalTime =  (moment(item.dates[item.dates.length - 1],"YYYY/MM/DD, HH:mm:ss").unix() - date.unix()) / (60*60*24)
        delayToSolve =  (moment(item.dates[item.dates.length - 1],"YYYY/MM/DD, HH:mm:ss").unix() - moment(item.dates[0],"YYYY/MM/DD, HH:mm:ss").unix()) / (60*60*24)
      }

      if (item.passed === "accepted")
        passedNumeric = 1

      if (item.t_shirt && item.t_shirt.length > 0 ){
        if (item.t_shirt[0] !== 0)
          size = item.t_shirt[0]

        if (item.t_shirt[1] !== 0)
          complexity = item.t_shirt[1]
      }

      if (size > 0){
        var delayToSolve_size = delayToSolve / size
        var delayToBeAssigned_size = delayToSolve / size
        var totalTime_size = totalTime / size
        var numberBugs_size = numberOfBugs / size
      }

      if (complexity > 0){
        var delayToSolve_complexity = delayToSolve / complexity
        var delayToBeAssigned_complexity = delayToSolve / complexity
        var totalTime_complexity = totalTime / complexity
      }

      if (numberOfBugs > 0){
        var delayToSolve_bugs = delayToSolve / numberOfBugs
        var delayToBeAssigned_bugs = delayToSolve / numberOfBugs
        var totalTime_bugs = totalTime / numberOfBugs
      }

      if (assignements > 0){
        var delayToSolve_assignements = delayToSolve / assignements
        var delayToBeAssigned_assignements = delayToSolve / assignements
        var totalTime_assignements = totalTime / assignements
      }

      if (size > 0 && complexity > 0){
        var delayToSolve_size_complexity = delayToSolve / (size * complexity)
        var delayToBeAssigned_size_complexity = delayToSolve / (size * complexity)
        var totalTime_size_complexity = totalTime / (size * complexity)
      }

      var delayToSolve_delayToBeAssigned =  delayToBeAssigned - delayToSolve

      if (totalTime > 0){
        var delayToBeAssigned_totalTime =  delayToBeAssigned / totalTime
        var delayToSolve_totalTime =  delayToSolve / totalTime
      }

      this.data.push({
        date: date,
        dateOrder: date.format("YYYYMMDD"),
        numberOfBugs: numberOfBugs,
        delayToBeAssigned: delayToBeAssigned,
        totalTime: totalTime,
        delayToSolve: delayToSolve,
        passed: {passedNumeric},
        size: size,
        complexity: complexity,
        delayToSolve_size: delayToSolve_size,
        delayToBeAssigned_size: delayToBeAssigned_size,
        totalTime_size: totalTime_size,
        delayToSolve_complexity:  delayToSolve_complexity,
        delayToBeAssigned_complexity: delayToBeAssigned_complexity,
        totalTime_complexity: totalTime_complexity,
        delayToSolve_bugs: delayToSolve_bugs,
        delayToBeAssigned_bugs: delayToBeAssigned_bugs,
        totalTime_bugs: totalTime_bugs,
        delayToSolve_assignements: delayToSolve_assignements,
        delayToBeAssigned_assignements: delayToBeAssigned_assignements,
        totalTime_assignements: totalTime_assignements,
        delayToSolve_size_complexity: delayToSolve_size_complexity,
        delayToBeAssigned_size_complexity: delayToBeAssigned_size_complexity,
        totalTime_size_complexity: totalTime_size_complexity,
        delayToSolve_delayToBeAssigned: delayToSolve_delayToBeAssigned,
        delayToBeAssigned_totalTime: delayToBeAssigned_totalTime,
        delayToSolve_totalTime: delayToSolve_totalTime,
        numberBugs_size:numberBugs_size,
        numberOfPlatforms:numberOfPlatforms,
        duration: item.duration
      })
    })

//     t_shirt: shows the [size, complexity information].
// For size: 0: Unknown, 1: XS, 2: S, 3: M, 4:L, 5:XL
// For complexity: 0:None, 1:lGreen, 2:Yellow, 3:red

    this.data.sort(function(a, b) {
      a = a.dateOrder;
      b = b.dateOrder;
      return a<b ? -1 : a>b ? 1 : 0;
    });

    return this.data
  }
}
