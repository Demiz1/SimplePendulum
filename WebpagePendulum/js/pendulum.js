
function degToRad(deg) {
return deg* (Math.PI / 180.0);
} 
function radToDeg(rad){
return rad* (180.0/Math.PI);
}

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

function getMax(a){
return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}

function getMin(a){
return Math.min(...a.map(e => Array.isArray(e) ? getMin(e) : e));
}

function readInputIDAndUpdateWithRedValue(id,defaultValue){
  //replace eventual "," with "."
  input = document.getElementById(id).value.replace(/,/g,".");
  redValue = parseFloat(input);
  if (Number.isNaN(redValue)){
    redValue = defaultValue;
    console.log("Illegal input detected, reseting to default.");
  }
  document.getElementById(id).value = redValue;
  return redValue;
}


let defaultPendulumSettings = {
  "gravity" : 9.82,
  "length" :1,
  "mass" :1,
  "initialAngle":90,
  "initialAngleRate":5,
  "simTime" :10,
  "simStep" : 0.0025,
  "friction" : 0.9
};

class pendulumClass{
  constructor(settings){
    console.log("creating new pendulum");
    this.settings = settings;
    this.time = math.range(0,settings.simTime,settings.simStep);
    this.timeGraphElement = document.getElementById("graph_stateTime_main");
    this.pendulumGraphElement = document.getElementById("graph_stateViz_main");
    this.visRunning = false;
    this.MaxUpdatesPerSec = 20;
  }

  defineGraphTraces(){ 
    // TIME GRAPH
    this.degTrace = {
      x: this.time.toArray(),
      y: this.res.map(x => x[0]),
      mode: 'lines',
      name: 'Degree',
      line: {
        color: '#d02f34',
        width: 1.5
      }
    };
    this.velTrace = {
      x: this.time.toArray(),
      y: this.res.map(x => x[1]),
      mode: 'lines',
      name: 'Velocity',
      line: {
        color: '#2fd0cb',
        width: 1.5
      }
    };
    this.degCurPointTrace = {
      x: [0],
      y: [0],
      mode: 'scatter',
      name: 'Current degrees',
      marker: {
        color: '#d02f34',
        size: 10 }
    };
    this.velCurPointTrace = {
      x: [0],
      y: [0],
      mode: 'scatter',
      name: 'Current Velocity',
      marker: {
        color: '#2fd0cb',
        size: 10 }
    };
    this.timeTraces = [this.degTrace,this.velTrace,this.degCurPointTrace,this.velCurPointTrace];
    this.timeLayout = {
      showlegend: true,
      legend: {"orientation": "h"},
      title:"Simulation Result",
      xaxis: {range: [-1, this.settings.simTime+1]},
      yaxis: {range: [getMin(this.res)*1.5, getMax(this.res)*1.5]},
      mode:'line',
      margin:{
        l:0,
        r:0,
      }
    };
    this.GraphConfig = {responsive: true};
    // PENDULUM GRAPH
    this.ropeTrace = {
      x: [0,this.settings.length*Math.sin(degToRad(this.settings.initialAngle))],
      y: [0,-this.settings.length*Math.cos(degToRad(this.settings.initialAngle))],
      mode: 'line',
      line: {
        color: '#000000',
        width: 1.5
      }
    }
    this.BallScatter = {
      x: [this.settings.length*Math.sin(degToRad(this.settings.initialAngle))],
      y: [-this.settings.length*Math.cos(degToRad(this.settings.initialAngle))],
      mode: 'scatter',
      marker: {
        color: '#ff000c',
        size: 10 
      }
    }
    this.pendulumTraces = [this.ropeTrace,this.BallScatter];
    // calc aspectRatio for square graph
    this.xRange = [-this.settings.length*1.1,this.settings.length*1.1]
    this.yRange = [-this.settings.length*1.1,this.settings.length*1.1]
    this.pendulumVisLayout = {
      xaxis: {range: this.xRange},
      yaxis: {range: this.yRange,scaleanchor:'x'},
      title:"Pendulum state",
      showlegend: false
    }
  }
  drawData(){
    this.defineGraphTraces();
    if (!this.hasOwnProperty("res")){
      console.log("Simulation data not available (have you run the simulation?)");
      return;
    }
    console.log("Drawing graphs");
    Plotly.newPlot(this.timeGraphElement,this.timeTraces,this.timeLayout,this.GraphConfig);
    Plotly.newPlot(this.pendulumGraphElement,this.pendulumTraces,this.pendulumVisLayout,this.GraphConfig);
  }

  runSimulation(){
    this.eulerStepper([degToRad(this.settings.initialAngle),this.settings.initialAngleRate],this.settings.simStep);
    this.isReady = true;
  }

  accGivenState(curState){
    var ns = [curState[1],-(this.settings.gravity/this.settings.length) * Math.sin(curState[0]) - this.settings.friction*curState[1]];
    return ns;
  }

  eulerStepper(init,stepSize){
    this.res = Array.from(Array(this.time.size()[0]), () => new Array(init.length));
    this.res[0] = init;
    for(let i=0;i<this.time.size()[0]-1;i++){
      var stepAns = this.accGivenState(this.res[i]);
      this.res[i+1] = math.add(this.res[i], math.multiply(stepAns,stepSize))
    }
  }

  UpdateValuesAndRunSimulation(){
    console.log("reading values and updating simulation");
    //update values
    var newValues = {};
    for(var propName in defaultPendulumSettings) {
      newValues[propName] = readInputIDAndUpdateWithRedValue("input_"+propName,defaultPendulumSettings[propName]);
    }
    console.log(newValues);
    this.settings = newValues;
    //update time variable
    this.time = math.range(0,this.settings.simTime,this.settings.simStep);
    this.runSimulation();
    this.drawData();
  };

  async visualize(){
    if (this.visRunning){
      this.visRunning = false;
      document.getElementById("visualizeButton").innerText = "Visualize";
    }else{
      this.visRunning = true
      document.getElementById("visualizeButton").innerText = "Stop visualization";
    }
    //Calculate how much to jump by at each step
    let jump = Math.ceil(1/this.settings.simStep/this.MaxUpdatesPerSec);
    let extraDelay = 0; //if we have wery large step, we need to sleep aditional time
    if (1/this.settings.simStep<this.MaxUpdatesPerSec){
      jump = math.ceil(1/this.settings.simStep);
      extraDelay = (1-this.settings.simStep) * 1000;
    }
    var timeArray = this.time.toArray();
    for(let i=0;i<this.time.size()[0]-2 && this.visRunning;i+=jump){
      let t0 = performance.now();
      this.degCurPointTrace["x"][0] = timeArray[i];
      this.degCurPointTrace["y"][0] = this.res[i][0]; 
      this.velCurPointTrace["x"][0] = timeArray[i]; 
      this.velCurPointTrace["y"][0] = this.res[i][1]; 

      this.ropeTrace["x"][1] = this.settings.length*Math.sin(this.res[i][0])
      this.ropeTrace["y"][1] = -this.settings.length*Math.cos(this.res[i][0])
      this.BallScatter["x"][0] =  this.settings.length*Math.sin(this.res[i][0])
      this.BallScatter["y"][0] = -this.settings.length*Math.cos(this.res[i][0])
      
      Plotly.redraw(this.timeGraphElement);
      Plotly.redraw(this.pendulumGraphElement);
      let drawTime = performance.now()-t0;
      //ok to send negative values
      //sleep takes roughly 5ms to performe
      await sleep(1000/this.MaxUpdatesPerSec - drawTime - 5 + extraDelay); 
    }
  }
}

var pendulum = new pendulumClass(defaultPendulumSettings);
pendulum.UpdateValuesAndRunSimulation();  //run the simulation directly, so the plots are defined properly
document.getElementById("updateSimulationButton").addEventListener("click",function(){pendulum.UpdateValuesAndRunSimulation()});
document.getElementById("visualizeButton").addEventListener("click",function(){pendulum.visualize()});