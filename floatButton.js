const floatDom ={
    floatButton: document.querySelector('.float-button'),
    floatMenu: document.querySelector('.float-menu-list'),
    floatButtonIcon: document.querySelector('.float-button img'),
}

if(floatDom.floatButton && floatDom.floatMenu) {
    let isMenuOpen = false;
    floatDom.floatButton.addEventListener('click', () => {
        if(isMenuOpen) {
            floatDom.floatMenu.classList.remove('show');
            isMenuOpen = false;
            floatDom.floatButtonIcon.src = '../icons/add.svg';
        }else{
            isMenuOpen = true;
            floatDom.floatButtonIcon.src = '../icons/close.svg';
            floatDom.floatMenu.classList.add('show');
        }
    });
}