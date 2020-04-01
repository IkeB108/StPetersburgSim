function setup() {
  createCanvas(500,500);
  runTestButton = {'x':(width/2)-75,'y':400,'w':150,'h':40,'text':'Run test'}
  run50TestsButton = {'x':(width/2)-70,'y':455,'w':140,'h':30,'text':'Run 100 tests'}
  //each coin outcome = 'success' or 'fail'
  coins = [];
  testOngoing = false;
  testState = {
    'testOngoing':false,
    'x':30,
    'y':85,
    'currentTotal':1,
  }
  successChance = 0.5; //probability of a success (50% in a coin flip)
  running50Tests = false;
  run50TestsProgress = 0; //how many tests have been run out of the 50 requested
  winnings = [];

  frameDelay = 15; //set frameDelay to 15 in normal test, 2 in 50 tests

  pSuccessInput = createInput('0.5')
  pSuccessInput.position(windowWidth/2 - 30, windowHeight/2 - 242)
  pSuccessInput.size(40)
  pSuccessInput.input(pSuccessInputUpdated)
  highestWinning = 1;

  displayingHistogram = false;
}
function windowResized(){
  pSuccessInput.position(windowWidth/2 - 30, windowHeight/2 - 242)
}
function pSuccessInputUpdated(){
  if(float(this.value()))successChance = float(this.value());
}
function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  dispButton(runTestButton);
  dispButton(run50TestsButton);
  dispCoins();
  if(testState.testOngoing && frameCount % frameDelay == 0){
    if(random() < successChance)var outcome = 'success';
    else var outcome = 'fail';
    coins.push({
      'x':testState.x,
      'y':testState.y,
      'outcome':outcome,
      'value':testState.currentTotal,
    })
    if(outcome == 'success'){
      testState.x += 30;
      testState.currentTotal *= 2;
    } else {
      testState.testOngoing = false;
      testState.y += 30;
      winnings.push(testState.currentTotal);
      if(highestWinning < testState.currentTotal)highestWinning = testState.currentTotal;
      testState.currentTotal = 1;
      if(running50Tests && run50TestsProgress < 99)initiateTest();
      if(running50Tests)run50TestsProgress ++;

      if(run50TestsProgress == 100){
        running50Tests = false;
        run50TestsProgress = 0;
        frameDelay = 15;
      }

    }
  }

  fill(255); noStroke(); textSize(20); textAlign(LEFT);
  var averageWinnings = 0;
  for(var i = 0; i < winnings.length; i ++)averageWinnings += winnings[i];
  averageWinnings /= winnings.length;
  averageWinnings = floor(averageWinnings*100)/100;
  if(winnings.length == 0)averageWinnings = 0;
  text("Average winnings: $" + averageWinnings, 10, 50)
  text("Probability of success:", 10,20)

  fill(170); textSize(15);
  text("Space = \nToggle Histogram", 15,height-35)

  if(displayingHistogram)dispHistogram(50,width-50);
}
function keyTyped(){
  if(key == ' ')displayingHistogram = !displayingHistogram;
}
function dispHistogram(minX,maxX){
  background(0,180)
  var binWidth = floor(highestWinning/30) + 1
  var bins = [];
  for(var i = 0; i < ceil(highestWinning/binWidth)+1; i ++){
    bins.push(0);
  }
  //0th bin holds values 0-2; 1st bin holds values 2-4
  for(var i = 0; i < winnings.length; i ++){
    var binIndex = floor(winnings[i]/binWidth);
    bins[binIndex] += 1;
  }
  var largestBinSize = 0;
  for(var i = 0; i < bins.length; i ++){
    if(bins[i] > largestBinSize)largestBinSize = bins[i];
  }

  dispX = minX;
  dispY = 300;
  dispW = (maxX-minX)/bins.length
  if(dispW<1)dispW = 1;
  for(var i = 0; i < bins.length; i ++){
    fill(255,100); noStroke();
    var dispH = -1 * (bins[i]/largestBinSize) * 100;
    var mouseYCorrect = (mouseY > dispY-100) && (mouseY < dispY)
    if(mouseYCorrect && mouseX > (dispX + (i * dispW)) && mouseX < dispX + (i * dispW) + dispW){
      fill(255);
      textAlign(CENTER); textSize(15);
      text(bins[i] + ' tests',dispX + (i * dispW) + (dispW/2), 180)
      text('Winnings =\n$' + (i * binWidth) + ' - $' + (((i+1) * binWidth)-0.01),dispX + (i * dispW) + (dispW/2), 320)
    }
    rect(dispX + (i*dispW),dispY,dispW,dispH);
  }
  noFill(); stroke(255); strokeWeight(1);
  rect(minX,dispY-100,(maxX-minX),100)
}
function dispCoins(){
  for(var i = 0; i < coins.length; i ++){
    dispCoin(coins[i])
  }
}
function dispCoin(Coin){
  noStroke();
  push();
  textSize(15);
  translate(Coin.x,Coin.y)
  if(Coin.outcome == 'success')fill(55, 176, 116);
  if(Coin.outcome == 'fail')fill(176, 55, 55);
  ellipse(0,0,20);
  fill(255);
  text('$' + Coin.value, 0, 0);
  pop();
}
function mouseClicked(){
  if(hitButton(runTestButton,mouseX,mouseY) && !testState.testOngoing){
    initiateTest();
  }
  if(hitButton(run50TestsButton,mouseX,mouseY) && !running50Tests){
    running50Tests = true;
    initiateTest();
    frameDelay = 1;
  }
}
function initiateTest(){
  testState.testOngoing = true;
  testState.x = 30;

  if(testState.y > height - 30){
    testState.y = 85;
    coins = [];
  }
}
function dispButton(buttonVar){
  push();
  textSize(20);
  translate(buttonVar.x,buttonVar.y)
  stroke(0);strokeWeight(1);
  if(testState.testOngoing)fill(100);
  else fill(255);
  rect(0,0,buttonVar.w,buttonVar.h)
  noStroke(); fill(0);
  text(buttonVar.text, buttonVar.w/2, buttonVar.h/2)
  pop();
}
function hitButton(buttonVar,x,y){
  return (collidePointRect(mouseX,mouseY,buttonVar.x,buttonVar.y,buttonVar.w,buttonVar.h))
}
