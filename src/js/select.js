export default function(){
    let selectHeader = document.querySelectorAll(".select__header");
    let selectItem = document.querySelectorAll('.select__item');


    selectHeader.forEach(item => {
        item.addEventListener('click', selectToggle);
    });

    selectItem.forEach(item => {
        item.addEventListener('click', selectChoose);
    });

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

    function selectChoose() {
        let text = this.innerText;
        let select = this.closest('.select');
        let currentText = select.querySelector('.select__current');
        currentText.innerText = text;
        select.classList.remove('is-active');
    }
}