import {Game} from './Game.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    const game = new Game(canvas);
    console.log(game);

    // graphics loop (update screen)
    function animate() {

    }


});