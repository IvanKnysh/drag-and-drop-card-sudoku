'use strict'

/*
* Завдання 1 Фруктова корзина (version 2.0)
* */
class Cart {
    constructor() {
        this.wrapper = document.querySelector('.task-1');
        this.ul1 = this.wrapper.querySelector('#ul-content-1');
        this.cart = this.wrapper.querySelector('#ul-content-2');
        this.cartCountWrapper = this.wrapper.querySelector('#cart-count');
        this.trash = this.wrapper.querySelector('.trash');
        this.basket = this.cart.closest('.right').getBoundingClientRect();
        this.trashRect = this.trash.getBoundingClientRect();
        this.flag = false;
        this.coordinates = {};
    }

    cartCount() {
        this.cartCountWrapper.textContent = this.cart.childElementCount;
    }

    hoverBasket(e) {
        if (e.pageX >= this.basket.left && e.pageX <= this.basket.right && e.pageY >= this.basket.top && e.pageY <= this.basket.bottom) {
            this.cart.closest('.right').classList.add('active');
        } else {
            this.cart.closest('.right').classList.remove('active');
        }
    }

    hoverTrash(e) {
        if (e.pageX >= this.trashRect.left && e.pageX <= this.trashRect.right && e.pageY >= this.trashRect.top && e.pageY <= this.trashRect.bottom) {
            this.trash.classList.add('hover');
        } else {
            this.trash.classList.remove('hover');
        }
    }

    changePositionStyles(target, e) {
        target.style.position = 'absolute';
        target.style.left = (e.pageX - this.coordinates.x) + 'px';
        target.style.top = (e.pageY - this.coordinates.y) + 'px';
        target.style.zIndex = 3;
    }

    mousedownCart() {
        this.cart.addEventListener('mousedown', (e) => {
            const target = e.target;

            if (target.parentElement === this.cart) {
                this.flag = true;
                this.coordinates = {
                    x: e.offsetX,
                    y: e.offsetY
                }
            }
        });
    }

    mousedown() {
        this.ul1.addEventListener('mousedown', (e) => {
            const target = e.target;

            if (target.localName === 'li') {
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

            document.body.classList.remove('disabled');

            if (target.localName === 'li' && target.parentElement === this.ul1) {
                if (e.pageX >= this.basket.left && e.pageX <= this.basket.right && e.pageY >= this.basket.top && e.pageY <= this.basket.bottom) {
                    const copy = target.cloneNode(true);
                    copy.removeAttribute('style');
                    this.cart.append(copy);
                }

                target.removeAttribute('style');
                this.cart.closest('.right').classList.remove('active');
                this.cartCount();
            }

            if (target.localName === 'li' && target.parentElement === this.cart) {
                if (e.pageX >= this.trashRect.left && e.pageX <= this.trashRect.right && e.pageY >= this.trashRect.top && e.pageY <= this.trashRect.bottom) {
                    target.remove();
                    this.trash.classList.remove('active');
                } else {
                    this.trash.classList.remove('active');
                }

                target.removeAttribute('style');
                this.cart.closest('.right').classList.remove('active');
                this.cartCount();
            }
        });
    }

    mousemove() {
        document.addEventListener('mousemove', (e) => {
            const target = e.target;

            if (target.localName === 'li') {
                if (this.flag) {
                    this.changePositionStyles(target, e);
                    this.hoverBasket(e);
                    document.body.classList.add('disabled');
                }
            }

            if (target.parentElement === this.cart) {
                if (this.flag) {
                    this.changePositionStyles(target, e);
                    this.hoverTrash(e);
                    this.trash.classList.add('active');
                }
            }
        });
    }

    init() {
        this.mousedownCart();
        this.mousedown();
        this.mouseup();
        this.mousemove();
    }
}
const cart = new Cart();
cart.init();