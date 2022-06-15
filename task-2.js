'use strict'

/*
* Завдання 2 Гра “Судоку” для малюків 3-6 років (version 1.0)
* */
class Sudoku {
    constructor() {
        this.wrapper = document.querySelector('.task-2');
        this.items = this.wrapper.querySelector('.items');
        this.gameArea = this.wrapper.querySelector('.game-area');
        this.areaItem = this.gameArea.querySelectorAll('li');
        this.flag = false;
        this.coordinates = {};
    }

    changePositionStyles(target, e) {
        target.style.position = 'fixed';
        target.style.left = (e.pageX - this.coordinates.x) + 'px';
        target.style.top = (e.pageY - this.coordinates.y) + 'px';
        target.style.zIndex = 3;
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
                this.areaItem.forEach(item => {
                    const top = item.getBoundingClientRect().top;
                    const right = item.getBoundingClientRect().right;
                    const bottom = item.getBoundingClientRect().bottom;
                    const left = item.getBoundingClientRect().left;

                    if (e.pageX >= left && e.pageX <= right && e.pageY >= top && e.pageY <= bottom) {
                        if (item.childElementCount === 0) {
                            const copy = target.cloneNode(true);
                            copy.removeAttribute('style');
                            item.append(copy);
                        }
                    }
                });

                target.removeAttribute('style');
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
        this.changeGameAreaPosition();
        this.mousedown();
        this.mouseup();
        this.mousemove();
    }
}
const sudoku = new Sudoku();
sudoku.init();