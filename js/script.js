const alert = document.querySelector('.alert');
const form = document.querySelector('.painel-form');
const valueInput = document.getElementById('fieldPainel');
const btnSubmit = document.querySelector('.btn-submit');
const container = document.querySelector('.container-task');
const list = document.querySelector('.list-task');
const btnClear = document.querySelector('.btn-clear');

let editElement;
let editFlag = false;
let editID = "";


//Criando eventos
form.addEventListener('submit', addItem);
btnClear.addEventListener('click', clearAllItems);
window.addEventListener('DOMContentLoaded', setupItem);

//Adicionar item
function addItem(e){
    e.preventDefault();
    const value = valueInput.value;
    const id = new Date().getTime().toString();
    
    if( value !== '' && editFlag === false ){

        createItems(id,value);

        container.classList.add('active');
        displayAlert('Item inserido com sucesso!', 'sucess');
        clearFieldsDefault();
        addItemLocalStorage(id, value);               

    }else if( value !== '' && editFlag === true){
        editElement.innerHTML = value;
        displayAlert('item editado com sucesso!', 'sucess');
        editItemLocalStorage(editID, value);
        clearFieldsDefault();
    }else{
        displayAlert('Sorry! Preencha o campo!', 'danger');
    }    
}

//Valida mensagens de campos!
function displayAlert(text, style){
    alert.textContent = text;
    alert.classList.add(`alert-${style}`);

    setTimeout( () => {
        alert.textContent = '';
        alert.classList.remove(`alert-${style}`);
    },2000);
}

//Remove todos os campos preenchidos!
function clearAllItems(){
    const items = document.querySelectorAll('.list-task-item');
    
    if(items.length > 0){
        items.forEach( item => {
            list.remove(item);
        });
    }
    displayAlert('Todos os itens foram removidos!', 'sucess');
    container.classList.remove('active');
    clearFieldsDefault();
    localStorage.removeItem('list');
}

//Deleta o item selecionado!
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);
    
    if(list.children.length === 0){
        container.classList.remove('active');
    }

    displayAlert('Item removido com sucesso!', 'sucess');
    clearFieldsDefault();
    removeItemLocalStorage(id);   
}

//Edita o item selecionado!
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    valueInput.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    btnSubmit.textContent = 'Editar';
}

//Limpa o campos após ser preenchido!
function clearFieldsDefault(){
    valueInput.value = '';
    editFlag = false;
    editID = '';
    btnSubmit.textContent = 'Adicionar';
}

//Armazenar dados no local storage.
function addItemLocalStorage(id, value){
    const addValue = {id, value}
    let items = getLocalStorage();
    items.push(addValue);
    localStorage.setItem('list', JSON.stringify(items));
}

//Editar dados no local storage
function editItemLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map( item => {
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));    
}

//Excluir dados no local stoorage
function removeItemLocalStorage(id){
    let items = getLocalStorage();
    //para remover usar filter no lugar de map
    items = items.filter(item => {
        if( item.id !== id){
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items)); 
}

//Verificar se tem ou se não tem e retorna o resultado.
function getLocalStorage(){
    return localStorage.getItem('list', JSON.stringify) ? JSON.parse(localStorage.getItem('list')) : [];
}

function createItems(id, value){
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

    //Deletar e editar
    const btnDelete = element.querySelector('.delete-btn');  
    const btnEdit = element.querySelector('.edit-btn');
    btnDelete.addEventListener('click', deleteItem);
    btnEdit.addEventListener('click', editItem); 

    list.appendChild(element);
}

function setupItem(){
    let items = getLocalStorage();
    if( items.length > 0 ){
        items = items.forEach((item) => {
            createItems(item.id, item.value)
        });
        container.classList.add('active');
    }
}