var config = {
    parent: game_canvas_container,
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game = new Phaser.Game(config);

var score = 0;
var scoreText;
var clueText;

var speed = 500;
var speedDiag = Math.round(speed * (1 / 1.44));

console.log(game);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function collectGoal(player, goal) {
    goal.disableBody(true, true);
    score += 1;
    scoreText.setText('SCORE: ' + score);
    let map_data = JSON.parse(sessionStorage.getItem("data"))
    let rand_int = getRandomInt(map_data['image_paths'].length)
    console.log(rand_int)
    clueText.setText("CLUE: " + map_data['image_paths'][rand_int].replace(".png", "").replace("_", " "))
    goal = this.physics.add.group({
        key: 'goal',
        repeat: 1,
        setXY: {
            x: map_data['X_coords'][rand_int],
            y: map_data['Y_coords'][rand_int]
        }
    });

    this.physics.add.overlap(player, goal, collectGoal, null, this);

}


// var json = require('./data.json');
// console.log(json)

// async function getMap() {
//     let map_path = "http://localhost:3000/assets/latent_space_map.json";

//     try {
//         let res = await fetch(map_path);
//         return await res.json();
//     } catch (error) {
//         console.log(error);
//     }
// }


function preload() {

    console.log('preload');

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(330, 340, 320, 50);

    this.load.on('progress', function(value) {
        // console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0x00FF00, 1);
        progressBar.fillRect(340, 350, 300 * value, 30);
    });

    this.load.on('fileprogress', function(file) {
        // console.log(file.src);
    });
    this.load.on('complete', function() {
        // console.log('complete');
        progressBar.destroy();
        progressBox.destroy();

    });

    this.load.setBaseURL('http://localhost:3000')

    this.load.json({
        key: 'map',
        url: 'assets/latent_space_map.json'
    });

    let map_path = "http://localhost:3000/assets/latent_space_map.json";

    fetch(map_path)
        .then(function(resp) {
            return resp.json()
        })
        .then(function(data) {
            // APIresults(data);
            sessionStorage.setItem("data", JSON.stringify(data));
            console.log('Saved data in session storage')
        })
        .catch(function() {});

    let data = JSON.parse(sessionStorage.getItem("data"))

    for (var i = 0; i < data['image_paths'].length; i++) {
        let image_path = "http://localhost:3000/assets/images_simple/" + data['image_paths'][i];
        this.load.image('signpost' + i, image_path);
    }

    this.load.image('goal', 'assets/goal.png');
    // this.load.image('logo', 'assets/logo.png');
    this.load.image('background', 'assets/latent_space_background_8bit.png');
    // this.load.image('floor_grid', 'assets/108_colour_ 512_clip_2d_pca_trimmed.png');
    // this.load.image('floor_grid', 'assets/volcano_background.png');
    // this.load.image('horz_edge', 'assets/horz_platform_thin.png');
    // this.load.image('vert_edge', 'assets/vert_platform_thin.png');

    this.load.spritesheet(
        'leafy_druid',
        'assets/leafy_druid_spritesheet_transparent.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    this.load.spritesheet(
        'fire_wizard',
        'assets/fire_wizard_spritesheet_transparent.png', {
            frameWidth: 64,
            frameHeight: 64
        });
}

// var platforms;
var cursors;
var player;
var x_start_point = 500;
var y_start_point = 500;

var name_of_sprite = 'fire_wizard';

function create() {

    console.log('Getting Map data')

    let map_data = JSON.parse(sessionStorage.getItem("data"))


    console.log('Creating game')

    // Background

    let bg = this.add.tileSprite(0, 0, 10000, 10000, 'background').setScrollFactor(0.3);

    // Signposts

    signposts = this.physics.add.staticGroup();

    for (var i = 0; i < map_data['image_paths'].length; i++) {
        let sp = signposts.create(map_data['X_coords'][i], map_data['Y_coords'][i], 'signpost' + i).setOrigin(0, 0);
    }

    console.log("after signpost loop")

    // Player & Cursor

    player = this.physics.add.sprite(x_start_point, x_start_point, name_of_sprite).setScale(1);

    player.body.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    console.log("after player")

    // Clue & Goal

    var style = {
        font: "32px Arial",
        fill: "#ffffff",
        wordWrap: {
            width: 800
        },
        align: "left",
        backgroundColor: "#00000",
        padding: 5,
    };

    clueText = this.add.text(0, 0, "", style);

    let rand_int = getRandomInt(map_data['image_paths'].length)
    clueText.setText('CLUE: ' + map_data['image_paths'][rand_int].replace(".png", "").replace(/_/g, " "))
    goal = this.physics.add.group({
        key: 'goal',
        repeat: 1,
        setXY: {
            x: map_data['X_coords'][rand_int],
            y: map_data['Y_coords'][rand_int]
        }
    })

    this.physics.add.overlap(player, goal, collectGoal, null, this);

    scoreText = this.add.text(0, 0, 'SCORE: 0', style);


    //Edges

    this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight, true, true, true, false);

    // platforms = this.physics.add.staticGroup();

    // let edge = platforms.create(0, 0, 'horz_edge').setOrigin(0, 0)


    // t_edge = platforms.create(0, 0, 'horz_edge').setOrigin(0, 0).setScale(10).refreshBody();
    // // scale = map_size_pixels / edge.displayWidth
    // // long_side = edge.displayWidth * scale
    // // short_side = edge.displayHeight * scale
    // // t_edge
    // b_edge = platforms.create(0, bg.displayWidth - 50, 'horz_edge').setOrigin(0, 0).setScale(10).refreshBody();
    // l_edge = platforms.create(0, 0, 'vert_edge').setOrigin(0, 0).setScale(10).refreshBody();
    // r_edge = platforms.create(bg.displayWidth - 50, 0, 'vert_edge').setOrigin(0, 0).setScale(10).refreshBody();


    // console.log("after platforms")


    //Goal

    // goal = this.physics.add.group({
    //     key: 'goal',
    //     repeat: 1,
    //     setXY: {
    //         x: 200,
    //         y: 200
    //     }
    // });

    //  {
    //     fontSize: '32px',
    //     fill: '#FFF'
    // }
    console.log("after goal")


    // Camera

    this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

    this.cameras.main.startFollow(player);

    player_map = this.physics.add.sprite(x_start_point, x_start_point, name_of_sprite).setScale(10);

    this.cameras.main.ignore(player_map);

    console.log("after camera")


    //  The miniCam
    this.minimap = this.cameras.add(695, 5, 300, 300).setZoom(0.03).setName('mini');
    this.minimap.setBackgroundColor(0x000000);
    this.minimap.scrollX = bg.displayWidth / 2;
    this.minimap.scrollY = bg.displayWidth / 2;
    this.minimap.ignore(bg);
    this.minimap.ignore(scoreText);
    this.minimap.ignore(clueText);
    this.minimap.ignore(player);


    console.log("after mini-camera")

    // Animations

    this.anims.create({
        key: 'forward',
        frames: this.anims.generateFrameNumbers('leafy_druid', {
            frames: [0, 1, 2]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('leafy_druid', {
            frames: [4, 5, 6]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('leafy_druid', {
            frames: [8, 9, 10]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'back',
        frames: this.anims.generateFrameNumbers('leafy_druid', {
            frames: [12, 13, 14]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('leafy_druid', {
            frames: [1]
        }),
        frameRate: 12
    });

    this.anims.create({
        key: 'forward_fire',
        frames: this.anims.generateFrameNumbers('fire_wizard', {
            frames: [0, 1, 2]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'left_fire',
        frames: this.anims.generateFrameNumbers('fire_wizard', {
            frames: [4, 5, 6]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'right_fire',
        frames: this.anims.generateFrameNumbers('fire_wizard', {
            frames: [8, 9, 10]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'back_fire',
        frames: this.anims.generateFrameNumbers('fire_wizard', {
            frames: [12, 13, 14]
        }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'turn_fire',
        frames: this.anims.generateFrameNumbers('fire_wizard', {
            frames: [1]
        }),
        frameRate: 12
    });

    console.log("Game Created")
}

function update() {

    player.body.setVelocity(0);
    player.anims.play('turn_fire', true);

    //  Horizontal Movement

    if (cursors.left.isDown) {

        player.setVelocityX(-speed);
        player.anims.play('left_fire', true);
    }

    if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('right_fire', true);
    }

    //  Vertical Movement

    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
        player.anims.play('back_fire', true);
    }

    if (cursors.down.isDown) {
        player.setVelocityY(speed);
        player.anims.play('forward_fire', true);
    }

    // Diagonal movement
    // Up and left

    if (cursors.left.isDown && cursors.up.isDown) {
        player.setVelocityX(-speedDiag);
        player.setVelocityY(-speedDiag);
        // player.anims.play('back_fire', false);
    }

    // Up and right
    if (cursors.right.isDown && cursors.up.isDown) {
        player.setVelocityX(speedDiag);
        player.setVelocityY(-speedDiag);
        // player.anims.play('back_fire', false);
    }

    // Down and right
    if (cursors.right.isDown && cursors.down.isDown) {
        player.setVelocityX(speedDiag);
        player.setVelocityY(speedDiag);
        // player.anims.play('forward_fire', false);
    }

    // Down and left
    if (cursors.left.isDown && cursors.down.isDown) {
        player.setVelocityX(-speedDiag);
        player.setVelocityY(speedDiag);
        // player.anims.play('forward_fire', false);
    }

    // scoreText.x = Math.floor((player.x + player.width / 2) - 350);
    // scoreText.y = Math.floor((player.y + player.height / 2) - 300);

    // clueText.x = Math.floor((player.x + player.width / 2) - 350);
    // clueText.y = Math.floor((player.y + player.height / 2) + 200);

    player_map.body.x = player.body.x - 100
    player_map.body.y = player.body.y - 100

    scoreText.x = Math.floor((player.body.x + player.width / 2) - 450);
    scoreText.y = Math.floor((player.body.y + player.height / 2) - 300);

    clueText.x = Math.floor((player.body.x + player.width / 2) - 450);
    clueText.y = Math.floor((player.body.y + player.height / 2) + 200);

}

function render() {

    // this.debug.cameraInfo(this.camera, 32, 32);
    // this.debug.spriteCoords(player, 32, 500);

}