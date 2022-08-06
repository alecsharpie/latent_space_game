import "./styles.css";
import { data } from 'autoprefixer';
import latent_space_map from './assets/sac_latent_space_map.json';
// import goal_img from './assets/goal.png';
// import bg_img from './assets/latent_space_background_8bit.png';

sessionStorage.setItem("latent_space_map", JSON.stringify(latent_space_map))

// function importAll(r) {
//     return r.keys().map(r);
// }

// const images = importAll(require.context('./assets/artist_images_semisimple/', false, /\.(png|jpe?g|svg)$/));

var name_of_sprite;

function createGame(avatar) {

    console.log(avatar)

    var config = {
        parent: game_canvas_container,
        type: Phaser.AUTO,
        width: 800,
        height: 600,
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

    name_of_sprite = avatar;

    console.log(name_of_sprite)

    // sessionStorage.setItem("name_of_sprite", name_of_sprite)

    var game = new Phaser.Game(config);

    var score = 0;
    var scoreText;
    var clueText;

    var speed = 500;
    var speedDiag = Math.round(speed * (1 / 1.44));

    var num_goals = 1;
    var goal;

    var map_data;

    console.log(game);

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function collectGoal(player, goal) {

        // goal.disableBody(true, true);
        goal.destroy();
        score += 1;
        scoreText.setText('SCORE: ' + score);

        let map_data = JSON.parse(sessionStorage.getItem("latent_space_map"))
            // let all_map_data = {};

        // map_data['image_paths'] = all_map_data['image_paths']
        // map_data['X_coords'] = all_map_data['X_coords']
        // map_data['Y_coords'] = all_map_data['Y_coords']

        let rand_int = getRandomInt(map_data['image_paths'].length)
        console.log(rand_int)
        clueText.setText("CLUE: " + map_data['image_paths'][rand_int].replace(".png", "").replace("_", " "))
        goal = this.physics.add.group({
            key: 'goal',
            repeat: 1,
            setXY: {
                x: map_data['X_colour_coords'][rand_int] * 1000,
                y: map_data['Y_colour_coords'][rand_int] * 1000
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

        // this.load.setBaseURL('http://localhost:3000')
        this.load.setBaseURL('https://storage.googleapis.com/www.latentspacegame.com/')

        // this.load.json({
        //     key: 'map',
        //     url: 'assets/latent_space_map_semisimple.json'
        // });

        // let map_path = "http://localhost:3000/assets/latent_space_map_semisimple.json";

        // fetch(map_path)
        //     .then(function(resp) {
        //         return resp.json()
        //     })
        //     .then(function(data) {
        //         // APIresults(data);
        //         sessionStorage.setItem("data", JSON.stringify(data));
        //         console.log('Saved data in session storage')
        //     })
        //     .catch(function() {});

        map_data = JSON.parse(sessionStorage.getItem("latent_space_map"))

        console.log(map_data)
        console.log(map_data['image_paths'])

        // let local_path = "http://localhost:3000/assets/artist_images_semisimple/"
        let gcp_bucket_path = "https://storage.googleapis.com/www.latentspacegame.com/"

        for (var i = 0; i < map_data['image_paths'].length; i++) {
            let image_path = gcp_bucket_path + 'sac_images_subset/' + map_data['image_paths'][i];
            this.load.image('signpost' + i, encodeURI(image_path));
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
    var player_map;
    var x_start_point = 500;
    var y_start_point = 500;

    // var name_of_sprite = 'fire_wizard';
    // var name_of_sprite = avatar;

    function create() {

        console.log('Getting Map data')

        let map_data = JSON.parse(sessionStorage.getItem("latent_space_map"))
            // let all_map_data = {};
            // map_data['image_paths'] = all_map_data['image_paths']
            // map_data['X_coords'] = all_map_data['X_coords']
            // map_data['Y_coords'] = all_map_data['Y_coords']


        console.log(map_data);
        console.log('Creating game')

        // Background

        let bg = this.add.tileSprite(0, 0, 10000, 10000, 'background').setScrollFactor(0.3);

        // Signposts

        var signposts = this.physics.add.staticGroup();

        // only take first 100

        for (var i = 0; i < map_data['image_paths'].length; i++) {
            signposts.create(map_data['X_colour_coords'][i] * 1000, map_data['Y_colour_coords'][i] * 1000, 'signpost' + i).setOrigin(0, 0);
            console.log(map_data['image_paths'][i])
            console.log(map_data['X_colour_coords'][i] * 1000)
            console.log(map_data['Y_colour_coords'][i] * 1000)
        }

        console.log("after signpost loop")

        // Player & Cursor

        player = this.physics.add.sprite(500, 500, name_of_sprite).setScale(1);

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

        // only take first 100

        let rand_int = getRandomInt(map_data['image_paths'].length)
        let clue_path = map_data['image_paths'][rand_int]
        clueText.setText('CLUE: ' + clue_path.replace(".png", "").replace(/_/g, " "))

        console.log(map_data['image_paths'].indexOf(clue_path))
        console.log(rand_int)

        goal = this.physics.add.group({
            key: 'goal',
            repeat: 1,
            setXY: {
                x: (map_data['X_colour_coords'][rand_int]) * 1000,
                y: (map_data['Y_colour_coords'][rand_int]) * 1000
            }
        });

        // console.log('coords_rand')

        // console.log((map_data['X_colour_coords'][rand_int]) * 100)
        // console.log((map_data['Y_colour_coords'][rand_int]) * 100)


        // console.log(map_data['image_paths'].indexOf((map_data['X_coords'][rand_int])))
        // console.log(map_data['image_paths'].indexOf((map_data['Y_coords'][rand_int])))

        // console.log('coords_img')

        // console.log((map_data['X_colour_coords'][map_data['image_paths'].indexOf(clue_path)]))
        // console.log((map_data['Y_colour_coords'][map_data['image_paths'].indexOf(clue_path)]))
        // console.log(map_data['image_paths'][map_data['image_paths'].indexOf(clue_path)]);


        // console.log(map_data['image_paths'].length)
        // console.log(map_data['X_colour_coords'].length)
        // console.log(map_data['Y_colour_coords'].length)

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

        player_map = this.physics.add.sprite(500, 500, name_of_sprite).setScale(10);

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


        // Follow cursor

        this.input.on('pointermove', function(pointer) {
            this.physics.moveToObject(player, { x: pointer.worldX, y: pointer.worldY }, 240);
        }, this);

        // Animations

        var char_list = ['fire_wizard', 'leafy_druid'];

        for (var i = 0; i < char_list.length; i++) {

            console.log(char_list)
            console.log(char_list[i])

            this.anims.create({
                key: 'forward_' + char_list[i],
                frames: this.anims.generateFrameNumbers(char_list[i], {
                    frames: [0, 1, 2]
                }),
                frameRate: 12,
                repeat: -1
            });

            this.anims.create({
                key: 'left_' + char_list[i],
                frames: this.anims.generateFrameNumbers(char_list[i], {
                    frames: [4, 5, 6]
                }),
                frameRate: 12,
                repeat: -1
            });

            this.anims.create({
                key: 'right_' + char_list[i],
                frames: this.anims.generateFrameNumbers(char_list[i], {
                    frames: [8, 9, 10]
                }),
                frameRate: 12,
                repeat: -1
            });

            this.anims.create({
                key: 'back_' + char_list[i],
                frames: this.anims.generateFrameNumbers(char_list[i], {
                    frames: [12, 13, 14]
                }),
                frameRate: 12,
                repeat: -1
            });

            this.anims.create({
                key: 'turn_' + char_list[i],
                frames: this.anims.generateFrameNumbers(char_list[i], {
                    frames: [1]
                }),
                frameRate: 12
            });

        }

        // this.anims.create({
        //     key: 'forward_fire',
        //     frames: this.anims.generateFrameNumbers('fire_wizard', {
        //         frames: [0, 1, 2]
        //     }),
        //     frameRate: 12,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'left_fire',
        //     frames: this.anims.generateFrameNumbers('fire_wizard', {
        //         frames: [4, 5, 6]
        //     }),
        //     frameRate: 12,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'right_fire',
        //     frames: this.anims.generateFrameNumbers('fire_wizard', {
        //         frames: [8, 9, 10]
        //     }),
        //     frameRate: 12,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'back_fire',
        //     frames: this.anims.generateFrameNumbers('fire_wizard', {
        //         frames: [12, 13, 14]
        //     }),
        //     frameRate: 12,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'turn_fire',
        //     frames: this.anims.generateFrameNumbers('fire_wizard', {
        //         frames: [1]
        //     }),
        //     frameRate: 12
        // });

        console.log("Game Created")
    }

    function update() {

        // let name_of_sprite = JSON.parse(sessionStorage.getItem("name_of_sprite"))

        // console.log(name_of_sprite)

        player.body.setVelocity(0);
        player.anims.play('turn_' + name_of_sprite, true);

        // if (this.input.mousePointer.isDown) {
        //     //  400 is the speed it will move towards the mouse
        //     this.physics.moveTo(player, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, null, 750);
        // }
        //  if it's overlapping the mouse, don't move any more
        // if (Phaser.Rectangle.contains(sprite.body, game.input.x, game.input.y)) {
        //     sprite.body.velocity.setTo(0, 0);
        // }
        // } else {
        //     sprite.body.velocity.setTo(0, 0);
        // }

        // }

        //  Horizontal Movement

        if (cursors.left.isDown) {

            player.setVelocityX(-speed);
            player.anims.play('left_' + name_of_sprite, true);
        }

        if (cursors.right.isDown) {
            player.setVelocityX(speed);
            player.anims.play('right_' + name_of_sprite, true);
        }

        //  Vertical Movement

        if (cursors.up.isDown) {
            player.setVelocityY(-speed);
            player.anims.play('back_' + name_of_sprite, true);
        }

        if (cursors.down.isDown) {
            player.setVelocityY(speed);
            player.anims.play('forward_' + name_of_sprite, true);
        }

        // Diagonal movement
        // Up and left

        if (cursors.left.isDown && cursors.up.isDown) {
            player.setVelocityX(-speedDiag);
            player.setVelocityY(-speedDiag);
            // player.anims.play('back_' + name_of_sprite, false);
        }

        // Up and right
        if (cursors.right.isDown && cursors.up.isDown) {
            player.setVelocityX(speedDiag);
            player.setVelocityY(-speedDiag);
            // player.anims.play('back_' + name_of_sprite, false);
        }

        // Down and right
        if (cursors.right.isDown && cursors.down.isDown) {
            player.setVelocityX(speedDiag);
            player.setVelocityY(speedDiag);
            // player.anims.play('forward_' + name_of_sprite, false);
        }

        // Down and left
        if (cursors.left.isDown && cursors.down.isDown) {
            player.setVelocityX(-speedDiag);
            player.setVelocityY(speedDiag);
            // player.anims.play('forward_' + name_of_sprite, false);
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

}

// someObj.addEventListener('click', some_function(someVar));

// var some_function = function(someVar) {
//     return function curried_func(e) {
//         // do something here
//     }
// }

let selected_avatar = document.getElementById('avatar').value;
console.log(selected_avatar)
document.getElementById('playButton').addEventListener('click', (evt) => createGame(selected_avatar));