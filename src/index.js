import "./styles.css";
import latent_space_map from './assets/sac_captions_latent_space_map.json';
sessionStorage.setItem("latent_space_map", JSON.stringify(latent_space_map))

if (localStorage.getItem("hiscore") === null) {
    localStorage.setItem("hiscore", 0)
}

// function importAll(r) {
//     return r.keys().map(r);
// }

// const images = importAll(require.context('./assets/artist_images_semisimple/', false, /\.(png|jpe?g|svg)$/));

var name_of_sprite;

var name_of_world;

function createGame() {

    document.getElementById("game_canvas_container").innerHTML = "";

    let avatar = document.getElementById('avatar').value;
    let world = document.getElementById('world').value;

    console.log(avatar)
    console.log(world)

    // document.getElementById("game_canvas_container").focus();

    var config = {
        parent: game_canvas_container,
        type: Phaser.AUTO,
        width: 900,
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
    name_of_world = world;

    // sessionStorage.setItem("name_of_sprite", name_of_sprite)

    var game = new Phaser.Game(config);

    // var score = 0;
    // var hiscore;
    // var scoreText;
    // var hiscoreText;
    // var clueText;

    var speed = 500;
    var speedDiag = Math.round(speed * (1 / 1.44));

    // var goal;
    // var platforms;

    var map_data;

    var cursors;
    var pointer;

    var player;
    var player_map;

    var prev_pointer_x = 0;
    var prev_pointer_y = 0;

    function getMean(number_list) {

        var sum = 0;
        for (var i = 0, l = number_list.length; i < l; i++) {
            sum += number_list[i];
        }
        var avg = sum / number_list.length;

        return avg;
    }

    // function getRandomInt(max) {
    //     return Math.floor(Math.random() * max);
    // }

    // function collectGoal(player, goal) {

    //     // goal.disableBody(true, true);
    //     goal.destroy();
    //     score += 1;
    //     scoreText.setText('SCORE: ' + score);

    //     let map_data = JSON.parse(sessionStorage.getItem("latent_space_map"))
    //         // let all_map_data = {};

    //     // map_data['image_paths'] = all_map_data['image_paths']
    //     // map_data['X_coords'] = all_map_data['X_coords']
    //     // map_data['Y_coords'] = all_map_data['Y_coords']

    //     let rand_int = getRandomInt(map_data['image_paths'].length)
    //     clueText.setText("CLUE: " + map_data['image_paths'][rand_int].replace(".png", "").replaceAll("_", " "))
    //     goal = this.physics.add.group({
    //         key: 'goal',
    //         repeat: 1,
    //         setXY: {
    //             x: map_data['X_' + name_of_world][rand_int] * 10,
    //             y: map_data['Y_' + name_of_world][rand_int] * 10
    //         }
    //     });

    //     this.physics.add.overlap(player, goal, collectGoal, null, this);

    //     if (score > localStorage.getItem('hiscore')) {
    //         localStorage.setItem("hiscore", score)
    //     }


    // }


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

        console.log('Pre-Loading Game...');

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(290, 275, 320, 50);

        this.load.on('progress', function(value) {
            progressBar.clear();
            progressBar.fillStyle(0x00FF00, 1);
            progressBar.fillRect(300, 285, 300 * value, 30);
        });

        this.load.on('fileprogress', function(file) {});
        this.load.on('complete', function() {
            progressBar.destroy();
            progressBox.destroy();

        });

        // this.load.setBaseURL('http://localhost:3000')
        this.load.setBaseURL('https://storage.googleapis.com/latentspacemuseum/')

        map_data = JSON.parse(sessionStorage.getItem("latent_space_map"))

        // let local_path = "http://localhost:3000"
        let gcp_bucket_path = "https://storage.googleapis.com/latentspacemuseum/"

        for (var i = 0; i < map_data['image_paths'].length; i++) {
            let image_path = gcp_bucket_path + 'sac_images_captions_subset/' + map_data['image_paths'][i];
            this.load.image('signpost' + i, encodeURI(image_path));
        }

        this.load.image('goal', 'assets/goal.png');
        this.load.image('background', 'assets/latent_space_background_8bit.png');

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

    function create() {

        console.log('Creating game...')

        let map_data = JSON.parse(sessionStorage.getItem("latent_space_map"))

        // mean position start

        var start_x_coord = getMean(map_data['X_' + name_of_world]) * 10;
        var start_y_coord = getMean(map_data['Y_' + name_of_world]) * 10;

        // Background

        let bg = this.add.tileSprite(0, 0, 10000, 10000, 'background').setScrollFactor(0.3);

        //Edges

        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight, true, true, true, false);

        // Signposts

        var signposts = this.physics.add.staticGroup();

        for (var i = 0; i < map_data['image_paths'].length; i++) {
            signposts.create((map_data['X_' + name_of_world][i] * 10), (map_data['Y_' + name_of_world][i] * 10), 'signpost' + i).setOrigin(0, 0);
        }

        // Player & Cursor

        player = this.physics.add.sprite(start_x_coord, start_y_coord, name_of_sprite).setScale(1);

        player.body.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();

        pointer = this.input.activePointer;

        // Clue & Goal

        // var style = {
        //     font: "32px Arial",
        //     fill: "#ffffff",
        //     wordWrap: {
        //         width: 800
        //     },
        //     align: "left",
        //     backgroundColor: "#00000",
        //     padding: 5,
        // };

        // clueText = this.add.text(0, 0, "", style);

        // let rand_int = getRandomInt(map_data['image_paths'].length)
        // let clue_path = map_data['image_paths'][rand_int]
        // clueText.setText('CLUE: ' + clue_path.replace(".png", "").replaceAll("_", " "))

        // goal = this.physics.add.group({
        //     key: 'goal',
        //     repeat: 1,
        //     setXY: {
        //         x: ((map_data['X_' + name_of_world][rand_int]) * 10),
        //         y: ((map_data['Y_' + name_of_world][rand_int]) * 10)
        //     }
        // });

        // this.physics.add.overlap(player, goal, collectGoal, null, this);

        // scoreText = this.add.text(0, 0, 'SCORE: 0', style);

        // hiscore = JSON.parse(localStorage.getItem("hiscore"))

        // hiscoreText = this.add.text(300, 0, 'HISCORE: ' + hiscore, style);

        // platforms = this.physics.add.staticGroup();
        // let edge = platforms.create(0, 0, 'horz_edge').setOrigin(0, 0)
        // t_edge = platforms.create(0, 0, 'horz_edge').setOrigin(0, 0).setScale(10).refreshBody();
        // scale = map_size_pixels / edge.displayWidth
        // long_side = edge.displayWidth * scale
        // short_side = edge.displayHeight * scale
        // b_edge = platforms.create(0, bg.displayWidth - 50, 'horz_edge').setOrigin(0, 0).setScale(10).refreshBody();
        // l_edge = platforms.create(0, 0, 'vert_edge').setOrigin(0, 0).setScale(10).refreshBody();
        // r_edge = platforms.create(bg.displayWidth - 50, 0, 'vert_edge').setOrigin(0, 0).setScale(10).refreshBody();


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


        // Camera

        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        this.cameras.main.startFollow(player);

        player_map = this.physics.add.sprite(start_x_coord, start_y_coord, name_of_sprite).setScale(10);

        this.cameras.main.ignore(player_map);

        //  The miniCam
        this.minimap = this.cameras.add(645, 5, 250, 250).setZoom(0.02).setName('mini');
        this.minimap.setBackgroundColor(0x000000);
        this.minimap.scrollX = bg.displayWidth / 2;
        this.minimap.scrollY = bg.displayWidth / 2;
        this.minimap.ignore(bg);
        // this.minimap.ignore(scoreText);
        // this.minimap.ignore(hiscoreText);
        // this.minimap.ignore(clueText);
        this.minimap.ignore(player);




        // Animations

        var char_list = ['fire_wizard', 'leafy_druid'];

        for (var i = 0; i < char_list.length; i++) {

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

        console.log("Game Created!")
    }

    function update() {

        // Diagonal movement

        // Up and left
        if (cursors.left.isDown && cursors.up.isDown) {
            player.setVelocityX(-speedDiag);
            player.setVelocityY(-speedDiag);
            player.anims.play('back_' + name_of_sprite, true);

            // Up and right
        } else if (cursors.right.isDown && cursors.up.isDown) {
            player.setVelocityX(speedDiag);
            player.setVelocityY(-speedDiag);
            player.anims.play('back_' + name_of_sprite, true);

            // Down and right
        } else if (cursors.right.isDown && cursors.down.isDown) {
            player.setVelocityX(speedDiag);
            player.setVelocityY(speedDiag);
            player.anims.play('forward_' + name_of_sprite, true);

            // Down and left
        } else if (cursors.left.isDown && cursors.down.isDown) {
            player.setVelocityX(-speedDiag);
            player.setVelocityY(speedDiag);
            player.anims.play('forward_' + name_of_sprite, true);

            //  Horizontal Movement

        } else if (cursors.left.isDown) {

            player.setVelocityX(-speed);
            player.setVelocityY(0);
            player.anims.play('left_' + name_of_sprite, true);

        } else if (cursors.right.isDown) {
            player.setVelocityX(speed);
            player.setVelocityY(0);
            player.anims.play('right_' + name_of_sprite, true);

            //  Vertical Movement

        } else if (cursors.up.isDown) {
            player.setVelocityY(-speed);
            player.setVelocityX(0);
            player.anims.play('back_' + name_of_sprite, true);

        } else if (cursors.down.isDown) {
            player.setVelocityY(speed);
            player.setVelocityX(0);
            player.anims.play('forward_' + name_of_sprite, true);


        } else if (pointer.isDown) {

            var x_diff = pointer.worldX - player.body.x;
            var y_diff = pointer.worldY - player.body.y;

            if (prev_pointer_x != pointer.worldX) {
                player.setVelocityX((pointer.worldX - player.body.x) * 5);


                if (Math.abs(y_diff) > Math.abs(x_diff) && y_diff > 0) {
                    player.anims.play('back_' + name_of_sprite, true);

                } else if (Math.abs(y_diff) > Math.abs(x_diff) && y_diff < 0) {
                    player.anims.play('forward_' + name_of_sprite, true);

                } else if (Math.abs(y_diff) < Math.abs(x_diff) && x_diff < 0) {
                    player.anims.play('left_' + name_of_sprite, true);

                } else if (Math.abs(y_diff) < Math.abs(x_diff) && x_diff > 0) {
                    player.anims.play('right_' + name_of_sprite, true);

                }
            }

            if (prev_pointer_y != pointer.worldY) {
                player.setVelocityY((pointer.worldY - player.body.y) * 5);

                if (Math.abs(y_diff) > Math.abs(x_diff) && y_diff < 0) {
                    player.anims.play('back_' + name_of_sprite, true);

                } else if (Math.abs(y_diff) > Math.abs(x_diff) && y_diff > 0) {
                    player.anims.play('forward_' + name_of_sprite, true);

                } else if (Math.abs(y_diff) < Math.abs(x_diff) && x_diff < 0) {
                    player.anims.play('left_' + name_of_sprite, true);

                } else if (Math.abs(y_diff) < Math.abs(x_diff) && x_diff > 0) {
                    player.anims.play('right_' + name_of_sprite, true);

                }
            }
            prev_pointer_x = pointer.worldX
            prev_pointer_y = pointer.worldY

        } else {

            player.body.setVelocity(0)
            player.anims.play('turn_' + name_of_sprite, true);

        }

        player_map.body.x = player.body.x - 320
        player_map.body.y = player.body.y - 320

        // scoreText.x = Math.floor((player.body.x + player.width / 2) - 350);
        // scoreText.y = Math.floor((player.body.y + player.height / 2) - 300);

        // hiscoreText.x = Math.floor((player.body.x + player.width / 2) - 150);
        // hiscoreText.y = Math.floor((player.body.y + player.height / 2) - 300);

        // clueText.x = Math.floor((player.body.x + player.width / 2) - 350);
        // clueText.y = Math.floor((player.body.y + player.height / 2) + 200);

    }

    function render() {

    }

}

document.getElementById('playButton').addEventListener('click', (evt) => createGame());