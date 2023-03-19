// Määritetään formi, inputti sekä lista objekteiksi (jatkossa niihin voi viitata käyttäen termejä jotka ovat määritetty const avainsanan jälkeen)
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
// Luodaan array joka varastoi tehtävät
let todos = [];
// Lisätään formille "kuuntelija" joka odottaa että submit event suoritetaan
todoForm.addEventListener('submit', function (event) {
  // Estetään sivua uudelleenlatautumasta kun submit event tapahtuu
  event.preventDefault();
  // Kutsutaan addTodo funktiota jonka arvona toimii input laatikkoon kirjoitettu tehtävä
  addTodo(todoInput.value);
});
// Luodaan addTodo funktio
function addTodo(item) {
  // Luodaan virheilmoitus joka aktivoituu jos input laatikkoon ei ole kirjoitettu mitään tai jos kirjoitettu tehtävä on alle 3 merkkiä pitkä
  if (item.length < 3) {
    alert("Kirjoita ensin jotain! (Vähintään 3 merkkiä)");
    // Vaihdetaan input laatikon taustaväri punaiseksi ja täten luodaan perinteinen error effekti
    todoInput.style.backgroundColor = 'red';
    return;

  }
  // Mikäli input laatikkoon syötetty tehtävä on "hyväksytty" luodaan syötetystä tehtävästä objekti, jolle määritetään id, nimi sekä completed status (statuksella saadaan myöhemmin efekti suoritetusta tehtävästä)
  else if (item !== '  ') {
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };
    // Lisätään todo objekti JS tiedoston alussa luotuun "todos" arrayyn
    todos.push(todo);
    // Lisätään samainen objekti myös selaimen localstorageen
    addToLocalStorage(todos);
    // Funktion lopuksi vielä tyhjennetään input kenttä sekä palautetaan kentän taustaväri takaisin valkoiseksi
    todoInput.value = '';
    todoInput.style.backgroundColor = 'white';
  }
}
// Luodaan funktio jonka avulla saadaan tehtävälista ilmestymään näytölle
function renderTodos(todos) {
  // "Clearataan" aluksi lista
  todoItemsList.innerHTML = '';
  // Käydään läpi jokainen listan tehtävä
  todos.forEach(function (item) {
    // Tarkastetaan onko tehtävällä completed statusta
    const checked = item.completed ? 'checked' : null;
    // Luodaaan tehtävästä <li> elementti ja luodaan sille data key, jotta se on mahdollista yksilöidä listasta
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);
    // Jos tehtävällä eli <li> objektilla on completed status niin lisätään sille "checked" class joka saa aikaan suoritetun tehtävän efektin (line-through tyylittelyllä) 
    if (item.completed === true) {
      li.classList.add('checked');
    }
    // Luodaan listan tehtävälle checkbox joka toimii suoritetun tehtävän kuittaajana sekä delete buttoni jonka avulla tehtävän voi poistaa listalta
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">X</button>
    `;
    // Lisätään <li> elementti <ul> listaan
    todoItemsList.append(li);
  });
}
// Luodaan funktio jonka avulla lisätään tehtävät localstorageen
function addToLocalStorage(todos) {
  // Muutetaan array stringiksi ja taltioidaan se localstorageen
  localStorage.setItem('todos', JSON.stringify(todos));
  // Renderöidään tehtävät näytölle käyttäen renderTodos funktiota
  renderTodos(todos);
}
// Luodaan funktio jonka avulla saadaan tehtäviä localstoragesta
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // Jos tehtävä löytyy muutetaan se takaisin arrayksi ja taltioidaan arrayhin sekä renderöidään tehtävät
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}
// Luodaan funktio jonka avulla saadaan muutettua tehtävä suoritetuksi tai ei suoritetuksi ja renderöi lopuksi "päivitetyn" listan
function toggle(id) {
  todos.forEach(function (item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });
  addToLocalStorage(todos);
}
// Luodaan funktio, joka poistaa tehtävän arrayltä, päivittää localstoragen poiston jälkeen ja renderöi lopuksi "päivitetyn" listan
function deleteTodo(id) {
  todos = todos.filter(function (item) {
    return item.id != id;
  });
  addToLocalStorage(todos);
}
// Haetaan kaikki tehtävät localstoragesta
getFromLocalStorage();
// Lisätään tehtävälistalle "kuuntelija" joka odottaa että delete buttonia tai checkboxia klikataan
// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoItemsList.addEventListener('click', function (event) {
  // Tarkastetaan klikattiinko checkboxia ja mikäli näin on yksilöidään tehtävä data keyllä ja suoritetaan sille toggle funktio joka aikaansaa suoritus efektin
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  // Tarkastetaan klikattiinko delete buttonia ja mikäli näin on yksilöidään tehtävä data keyllä ja suoritetaan sille deleteTodo funktio jolla saadaan tehtävä poistettua listasta
  if (event.target.classList.contains('delete-button')) {
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});