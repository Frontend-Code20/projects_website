const letterTypes = document.querySelectorAll('.letterType');
const tabs = document.querySelectorAll('.tab-item');
const formTabs = document.querySelector('.form-tabs');
const dashboard = document.querySelector('.dashboard');
const tabContents = document.querySelectorAll('.tab-content') 

// Modal variables
const modal = document.getElementById('preview-modal');
const closeBtn = document.getElementById('modal-close');

letterTypes.forEach((letterType, index) => {
    letterType.addEventListener('click', () => {
        displayForm(index);
    });
});

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        showContent(index);
    });
})

function displayForm(idx) {
    dashboard.style.display = "none"
    formTabs.style.display = "flex"
    tabContents.forEach((tabContent, index) => {
        if(index === idx){
            tabContent.style.display = 'flex'
            tabs[index].classList.add('active-tab');
        }else{
            tabContent.style.display = 'none'
            tabs[index].classList.remove('active-tab');
        }
    })
}


function showContent(idx){

    tabContents.forEach((tabContent, index) => {
        if(index === idx){
            tabContent.style.display = 'flex'
            tabs[index].classList.add('active-tab');
        }else{
            tabContent.style.display = 'none'
            tabs[index].classList.remove('active-tab');
        }
    })
}

// Modal script
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
});