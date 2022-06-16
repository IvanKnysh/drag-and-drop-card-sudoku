'use strict'

/*
* Завдання 2 Гра “Судоку” для малюків 3-6 років (version 1.0)
* */
class Sudoku {
    constructor() {
        this.wrapper = document.querySelector('.task-2');
        this.preloader = document.querySelector('#preloader');
        this.items = this.wrapper.querySelector('.items');
        this.gameArea = this.wrapper.querySelector('.game-area');
        this.areaItem = this.gameArea.querySelectorAll('li');

        this.audioClick = 'audio/user-click.wav';
        this.audioClickError = 'audio/click-error.wav';

        this.flag = false;
        this.coordinates = {};
        this.gameAreaArray = [];
    }

    soundClick(audio_src) {
        const audio = new Audio();
        audio.src = audio_src;
        audio.autoplay = true;
    }

    preloadPage() {
        setTimeout(() => {
            this.preloader.classList.add("hide-preloader");
            this.wrapper.classList.add("show-game-page");
        }, 3000);
    }

    changePositionStyles(target, e) {
        target.style.position = 'fixed';
        target.style.left = (e.pageX - this.coordinates.x) + 'px';
        target.style.top = (e.pageY - this.coordinates.y) + 'px';
        target.style.zIndex = 3;
    }

    fillGameAreaArray(item, i) {
        if (item.childElementCount !== 0) {
            const id = item.querySelector('span').dataset.id;
            this.gameAreaArray[i] = id;
        } else {
            this.gameAreaArray[i] = null;
        }
    }

    splitIntoSubarrays() {
        const size = 4;
        let subarray = [];

        if (this.gameAreaArray.every(elem => elem !== null)) {
            for (let i = 0; i < this.gameAreaArray.length / size; i++) {
                subarray.push( this.gameAreaArray.slice( (i * size), (i * size) + size ) );
            }

            console.log(subarray);
            return subarray;
        }
    }

    changeGameAreaPosition() {
        this.gameArea.addEventListener('mousedown', (e) => {
            const target = e.target;

            if (target.parentElement.localName === 'li') {
                this.flag = true;
                this.coordinates = {
                    x: e.offsetX,
                    y: e.offsetY
                }
            }
        });
    }

    mousedown() {
        this.wrapper.addEventListener('mousedown', (e) => {
            const target = e.target;

            if (target.parentElement === this.items) {
                this.flag = true;
                this.coordinates = {
                    x: e.offsetX,
                    y: e.offsetY
                }
            }
        });
    }

    mouseup() {
        document.addEventListener('mouseup', (e) => {
            const target = e.target;
            this.flag = false;

            this.items.classList.remove('disabled');

            if (target.parentElement === this.items) {
                this.areaItem.forEach((item, i) => {
                    const top = item.getBoundingClientRect().top;
                    const right = item.getBoundingClientRect().right;
                    const bottom = item.getBoundingClientRect().bottom;
                    const left = item.getBoundingClientRect().left;

                    if (e.pageX >= left && e.pageX <= right && e.pageY >= top && e.pageY <= bottom) {
                        if (item.childElementCount === 0) {
                            const copy = target.cloneNode(true);
                            copy.removeAttribute('style');
                            item.append(copy);
                            this.soundClick(this.audioClick);
                        } else {
                            this.soundClick(this.audioClickError);
                        }
                    }

                    this.fillGameAreaArray(item, i);
                });

                target.removeAttribute('style');
                this.splitIntoSubarrays();
            }

            if (target.parentElement.localName === 'li') {
                this.areaItem.forEach(item => {
                    const top = item.getBoundingClientRect().top;
                    const right = item.getBoundingClientRect().right;
                    const bottom = item.getBoundingClientRect().bottom;
                    const left = item.getBoundingClientRect().left;

                    if (e.pageX >= left && e.pageX <= right && e.pageY >= top && e.pageY <= bottom) {
                        if (item.childElementCount === 0) {
                            target.removeAttribute('style');
                            item.append(target);
                            this.soundClick(this.audioClick);
                        } else {
                            this.soundClick(this.audioClickError);
                        }
                    }
                });

                target.removeAttribute('style');
            }
        });
    }

    mousemove() {
        document.addEventListener('mousemove', (e) => {
            const target = e.target;

            if (target.parentElement === this.items) {
                if (this.flag) {
                    this.items.classList.add('disabled');
                    this.changePositionStyles(target, e);
                }
            }

            if (target.parentElement.localName === 'li') {
                if (this.flag) {
                    this.changePositionStyles(target, e);
                }
            }
        });
    }

    checkResultGame() {

    }

    init() {
        this.preloadPage();
        this.changeGameAreaPosition();
        this.mousedown();
        this.mouseup();
        this.mousemove();
    }
}
const sudoku = new Sudoku();
sudoku.init();