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
        this.audioGameOver = 'audio/game-over.wav';
        this.audioGameWin = 'audio/game-win.wav';

        this.flag = false;
        this.coordinates = {};
        this.gameAreaArray = [];
    }

    soundClick(audio_src, volume) {
        const audio = new Audio();
        audio.src = audio_src;
        audio.autoplay = true;
        if (volume) audio.volume = volume;
    }


    preloadPage() {
        setTimeout(() => {
            this.preloader.classList.add("hide-preloader");
            this.wrapper.classList.add("show-game-page");
        }, 3000);
    }

    addBasicPosition(data) {
        const getRandomItem = [];
        let keys = [];
        let values = [];

        getRandomItem.push(data[Math.floor(Math.random() * data.length)]);

        getRandomItem.forEach(item => {
            keys = Object.keys(item);
            values = Object.values(item);
        });

        for (let i = 0; i < values.length; i++) {
            this.areaItem[keys[i]].insertAdjacentHTML('beforeend', `
                <span data-id="${values[i]}">
                    <img src="img/${values[i]}.jpg" alt="">
                </span>
            `);
        }
    }

    getBasicPositionsFromJSON() {
        fetch('game.json')
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Response status is not 200');
                }
                return response.json();
            })
            .then(data => {
                this.addBasicPosition(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    gameResult(result) {
        if (result === 'loss') {
            document.querySelector('.popup').classList.add('active');
            document.querySelector('.overlay').classList.add('active');
            document.querySelector('.popup img').src = 'img/lose.png';
            this.soundClick(this.audioGameOver, 0.25);
        }

        if (result === 'win') {
            document.querySelector('.popup').classList.add('active');
            document.querySelector('.overlay').classList.add('active');
            document.querySelector('.popup img').src = 'img/win.gif';
            this.soundClick(this.audioGameWin, 0.25);
        }
    }

    changePositionStyles(target, e) {
        target.style.position = 'fixed';
        target.style.left = (e.pageX - this.coordinates.x) + 'px';
        target.style.top = (e.pageY - this.coordinates.y) + 'px';
        target.style.zIndex = 3;
    }

    fillGameAreaArray(item, i) {
        if (item.childElementCount !== 0) {
            this.gameAreaArray[i] = item.querySelector('span').dataset.id;
        } else {
            this.gameAreaArray[i] = null;
        }
    }

    checkArrayUniqueItems(arr) {
        let set = new Set();
        let result = false;
        arr.forEach(item => set.has(item) ? result = true : set.add(item));
        return result;
    }

    checkHorizontalArrays(arr) {
        if (this.checkArrayUniqueItems(arr[0])) {
            return true;
        }

        if (this.checkArrayUniqueItems(arr[1])) {
            return true;
        }

        if (this.checkArrayUniqueItems(arr[2])) {
            return true;
        }

        if (this.checkArrayUniqueItems(arr[3])) {
            return true;
        }
    }

    flipVerticalArrays(arr) {
        let result = [];

        arr.forEach(function (element, index) {
            var group = index % 4;
            var temp = result[group];

            if (!Array.isArray(temp)) {
                temp = [];
            }

            temp.push(element);
            result[group] = temp;
        });

        return result;
    }

    splitIntoSubarrays() {
        const size = 4;
        const subarray = [];
        const getFlipArrays = this.flipVerticalArrays(this.gameAreaArray);

        if (this.gameAreaArray.every(elem => elem !== null)) {
            for (let i = 0; i < this.gameAreaArray.length / size; i++) {
                subarray.push( this.gameAreaArray.slice( (i * size), (i * size) + size ) );
            }

            if (this.checkHorizontalArrays(subarray) || this.checkHorizontalArrays(getFlipArrays)) {
                this.gameResult('loss');
            } else {
                this.gameResult('win');
            }
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
                            this.soundClick(this.audioClick, 0.5);
                        } else {
                            this.soundClick(this.audioClickError, 0.5);
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
                            this.soundClick(this.audioClick, 0.5);
                        } else {
                            this.soundClick(this.audioClickError, 0.5);
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

    init() {
        this.preloadPage();
        this.getBasicPositionsFromJSON();
        this.changeGameAreaPosition();
        this.mousedown();
        this.mouseup();
        this.mousemove();
    }
}
const sudoku = new Sudoku();
sudoku.init();