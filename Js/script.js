let prizes = {
  count : 12,
  names : ["3000 Credits","35% Off","Hard Luck","70% OFF","Swagpack","100% OFF","Netflix","50% Off","Amazon Voucher","2 Extra Spin", "CB Tshirt","CB Book"]   
};

let config = {
    type : Phaser.CANVAS,
    width : 800,
    height : 600,
    backgroundColor : 0xffcc00,
    isSpin : 0,
    scene : {
        preload : preload,
        create : create,
        update : update,
        
    }
};

let game = new Phaser.Game(config);
function preload(){
    // console.log(this); displays object of scene
    console.log("preload");
    
    //loads image arguments are as (key,url).
    this.load.image('background','./Assets/background.jpg');
    
    this.load.image('pin','./Assets/pin.png');
    this.load.image('stand','./Assets/stand.png');
    this.load.image('wheel','./Assets/wheel.png'); 
    
    //
    this.load.audio('audio','./Assets/escape.wav');
}
function create(){
    console.log("create");
    //this.add.sprite(0,0,'background');
    //center of the image is assumed as (0,0) coordinate.
    //it means upper left corner is at coord. (Width/2,Height/2).
    
    let W = game.config.width;
    let H = game.config.height;
    // this.add.sprite(W/2,H/2,'background');
    // OR
    let background = this.add.sprite(0,0,'background');
    background.setPosition(W/2,H/2);
    
    //shrink everything by factor of 0.2
    background.setScale(0.2); 
    
    //creating stand
    let stand = this.add.sprite(W/2,H/2+256,'stand');
    stand.setScale(0.25);
    
    //creating wheel
    //let wheel = this.add.sprite(W/2,H/2,'wheel');
    this.wheel = this.add.sprite(W/2,H/2,'wheel');
    //wheel.setScale(0.25);
    this.wheel.setScale(0.25);
    
    //creating pin
    let pin = this.add.sprite(W/2,H/14,'pin');
    pin.setScale(0.30);
    
    //creating stand
    // let stand = this.add.sprite(W/2,H/2+256,'stand');
    //stand.setScale(0.25);
    //our stand is appearing in front of wheel to resolve it we can first create stand then wheel so wheel overlaps on stand
    //OR
    //we can set depth a greater value ,depth is zero by default.
    //greater depth more front.
    
    //increasing the scale along x-axis by twice.
    //wheel.scaleX = 2;
    //increasing the scale along y-axis by twice.
    //wheel.scaleY = 2;
    
    //alpha property defines opacity of object
    //this.wheel.alpha = 0.5;
    
    //Creating an event listeners
    //defining event which will execute on pointerdown. it will call some function spinwheel and passing this as context to access scene objects.
    //this.input.on("pointerdown",spinwheel,this);
    
    //creating text object for writing text
    //this.game_text = this.add.text(10,10,"Welcome to spin N win"); //giving coordinates and styling is default
    //styling font
    font_style = {
        color : "red",
        font : "bold 30px roboto",
        align : "center",
    }
    this.game_text = this.add.text(10,10,"Welcome to spin N win",font_style);
    
    //making button
    this.button_text = this.add.text(W/2+100,H/2+250,"Tap to Spin",font_style).setInteractive();
    this.button_text.on("pointerdown",spinwheel,this);
    this.button_text.on("pointerover",hover,this);
    this.button_text.on("pointerout",hoverOut,this);
    
    
}
function update(){
    console.log("update");
    //gives error as wheel is not defined in this scope
    //to make it work make let to this.wheel i.e. making it part of scene
    //this.wheel.scaleX += 0.01;
    //this.wheel.scaleY += 0.01;
    
    //At every update wheel will rotate by 1 degree
    //this.wheel.angle += 1;
    
    //reducing opacity
    //this.wheel.alpha -= 0.001;
    //this.wheel.alpha = 1;
    
    if(this.isSpin == 1){
    let colors = ["red","blue","yellow"];
    let rand = Phaser.Math.Between(0,2);
    this.game_text.setStyle({fill : colors[rand]});
    }
    
    
    
}

function spinwheel(){
    //if already spinning then return.
    if(this.isSpin == 1){
        return;
    }
    //else set spinning.
    this.isSpin = 1;
    
    //playing sound
    this.sound.play('audio');
    
    console.log('spinning wheel');
    console.log(this.isSpin);
    //updating text on click event
    //this.game_text.setText("You clicked down");
    
    //to make the angle random
    //gives number from 2 to 5
    let rounds = Phaser.Math.Between(2,5);
    let degree = rounds*360;
    //as there are 12 parts : 360/12 = 30 so that it stops at pin coinciding with the mark.
    let extra_degree = Phaser.Math.Between(0,11)*30;
    let total_angle = degree + extra_degree;
    
    //Adding tween for smooth transition and for stopping unlimited updation.
    tween = this.tweens.add({
        targets: this.wheel,
        //alpha: 0.1,
        //now it is being stopped abruptly after 1700 degree angle.
        angle: total_angle, // changing hard code value to a variable value.
        //to make its speed lower we will add ease property.
        ease: "Cubic.easeOut",
        //delay: 2000,
        duration: 4800,
        //trigger function after completion of 6000ms.
        
        //it gives this object to oncomplete method which is callback function called after completion of tween.
        callbackScope : this,
        onComplete: function(){
            //console.log("you won something");
            //displaying item you have won
            //console.log("you won " + prizes.names[prizes.count - 1 - extra_degree/(360/prizes.count)]);
            this.game_text.setText("you won " + prizes.names[prizes.count - 1 - extra_degree/(360/prizes.count)]);
            //this gives error as this is not accessible here so we need to add callbackscope before oncomplete function.
            
            //after completion of spin setting isSpin again zero which means it can spin now.
            this.isSpin = 0;
        },
        //can also add scalex scaley
        //scaleX : 0,
        //scaleY : 0.5,
    });
}

function hover(){
    this.button_text.setStyle({fill : "blue"});
}

function hoverOut(){
    this.button_text.setStyle({fill : "red"});
}