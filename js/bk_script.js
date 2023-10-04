const alert = document.querySelector('.alert');
const form = document.querySelector('.painel-form');
const fieldPainel = document.getElementById('fieldPainel');
const btnSubmit = document.querySelector('.btn-submit');
const container = document.querySelector('.container-task');
const list = document.querySelector('.list-task');
const btnClear = document.querySelector('.btn-clear');

let editElement;
let editFlag = false;
let editID = "";

form.addEventListener('submit', addItem);

btnClear.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItem)
/*FUNCTIONS*/

function addItem(e){
    e.preventDefault();
    const value = fieldPainel.value;
    const id = new Date().getTime().toString();
   
    if(value && !editFlag){

        createListItem(id,value);
        
        container.classList.add('active');
        displayAlert('Item adicionado com sucesso', 'sucess');
        addToLocaleStorage(id, value);
        setBackToDefault();
    }else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('Editado com sucesso', 'sucess');
        editLocalStorage(editID, value);
        setBackToDefault();
    }else{
       displayAlert('Preencha o campo!', 'danger');
    }
}

function displayAlert(text, action){
    alert.textContent = text
    alert.classList.add(`alert-${action}`);

    setTimeout( () => {
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`);
    },1000)
}

function clearItems(){
    const items = document.querySelectorAll('.list-task-item');
    if(items.length > 0){
        items.forEach(item =>{
            list.remove(item);
        });
    }
    container.classList.remove('active');
    displayAlert('Todos os itens foram removidos', 'sucess');
    setBackToDefault();
    localStorage.removeItem('list');
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('active');
    }
    displayAlert('Item deletado com sucesso!', 'sucess');
    setBackToDefault();
    removeFromLocalStorage(id);
}

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    fieldPainel.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    btnSubmit.textContent = 'edit';
}

function setBackToDefault(){
    fieldPainel.value = '';
    editFlag = false;
    editID = '';
    btnSubmit.textContent = 'Submit';
}

function addToLocaleStorage(id, value){
    const addLocal = {id, value}
    let items = getLocalStorage();
    items.push(addLocal);
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter( (item) => {
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map( (item) => {
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function setupItem(){
    let items = getLocalStorage();
    if( items.length > 0 ){
        items.forEach((item) => {
            createListItem(item.id, item.value);
        })
        container.classList.add('active');
    }
}

function createListItem(id, value){
    const element = document.createElement('article');

    element.classList.add('list-task-item');
    element.setAttribute('data-id', id);

    element.innerHTML = `        
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    list.appendChild(element);
}


/*

function answerComments(e){
    const element = e.currentTarget.parentElement.parentElement.parentElement;
    const id = e.currentTarget.parentElement.parentElement.parentElement.dataset.id;
  
    window.scrollTo(0, 0);
    
    btnSend.textContent = 'Responder Comentário';
    //btnSend.setAttribute('type', 'button');
    btnSend.setAttribute('id', 'btn-send-answer');

    debugger
    
    
    const btnSendAnswer = document.querySelector('#btn-send-answer');
    btnSendAnswer.addEventListener('click', (e) => {

        value = mensagem.value;
        const id = new Date().getTime().toString();
        debugger
        const newElement = document.createElement('section');
        newElement.classList.add('new-grid');
        newElement.setAttribute('data-id', id);
    
        newElement.innerHTML = `
            <div class="image">
                <img src="./images/img-1.jpg" id="img" />       
            </div>
            <div class="content">
                <div class="comments">
                    ${value}
                </div>
                <div class="answer">
                    <button class="link-answer">Responder</button>
                    <button class="link-exclude">Excluir</button>
                </div>
            </div>
        `;

        debugger
        
        element.after(newElement);
        
        btnSend.textContent = 'Publicar Comentário';
        //btnSend.setAttribute('type', 'submit');
        btnSend.setAttribute('id', 'btn-send');
        form.reset();
        displayAlert('Resposta enviada com sucesso!', 'sucess')
        
    })
}


*/