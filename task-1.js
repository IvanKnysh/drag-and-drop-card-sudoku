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
        this.basket = this.cart.closest('.right').getBoundingClientRect();
        this.flag = false;
        this.coordinates = {};
    }

    cartCount() {
        this.cartCountWrapper.textContent = this.cart.childElementCount;
    }

    hoverBasket(e) {
        if (e.pageX >= this.basket.left && e.pageX <= this.basket.right && e.pageY >= this.basket.top && e.pageY <= this.basket.bottom) {
            this.cart.closest('.right').style.border = '1px dashed #000';
        } else {
            this.cart.closest('.right').style.border = '';
        }
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

            if (target.localName === 'li') {
                if (e.pageX >= this.basket.left && e.pageX <= this.basket.right) {
                    target.removeAttribute('style');
                    const copy = target.cloneNode(true);
                    this.cart.append(copy);
                }

                target.removeAttribute('style');
                this.cart.closest('.right').style.border = '';
                this.cartCount();
            }
        });
    }

    mousemove() {
        this.wrapper.addEventListener('mousemove', (e) => {
            const target = e.target;

            if (target.localName === 'li') {
                if (this.flag) {
                    target.style.position = 'absolute';
                    target.style.left = (e.pageX - this.coordinates.x) + 'px';
                    target.style.top = (e.pageY - this.coordinates.y) + 'px';
                    target.style.zIndex = 2;
                    this.hoverBasket(e);
                }
            }
        });
    }

    init() {
        this.mousedown();
        this.mouseup();
        this.mousemove();
    }
}
const cart = new Cart();
cart.init();