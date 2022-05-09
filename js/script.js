

// SELETORES
const userID = document.querySelector('.userID');
const musicName = document.querySelector('.music-name');
const artistName = document.querySelector('.artist-name');
const genreName = document.querySelector('.select-genre');
const form = document.querySelector('.form-content');
const tableBody = document.querySelector('.crud-table>tbody');


// BUTTONS
const btnCreate = document.querySelector('.create');
const btnUpdate = document.querySelector('.uptade');
const btnDeleteAll = document.querySelector('.delete-all');


// SELETOR FUNC
const getLocalStorage = () => JSON.parse(localStorage.getItem('dbSongs')) ?? [];
const setLocalStorage = (songs) =>  localStorage.setItem('dbSongs', JSON.stringify(songs));




// ----------- CREATE ------------

const createSong = (song) => {
  const songs = getLocalStorage();
  songs.push(song);
  setLocalStorage(songs);
} 


// ----------- READ ------------
const readSong = () => getLocalStorage();


// ----------- UPDATE ------------
const updateSong = (id, song) => {
  const songs = readSong();
  songs[id] = song;
  setLocalStorage(songs)
}

// ----------- DELETE ------------
const deleteSong = (id) => {
  const songs = readSong()
  songs.splice(id, 1)
  setLocalStorage(songs)
}



// SALVAR -----------------------------
const saveSong = (event) => {
  event.preventDefault()
  if (isValidField()) {
    const song = {
      name: musicName.value,
      artist: artistName.value,
      genre: genreName.value
    }

    const index = document.querySelector('[data-new]').dataset.new;
    if (index == 'new') {
      createSong(song);
      updateTable();
      clearFilds();
      musicName.focus()      
    } else {
        updateSong(index, song);
        updateTable();
      }
  }
}



// Verificação se os campos são válidos e estão preenchidos
const isValidField = () => form.reportValidity()

// Limpar campos apos salvar música
const clearFilds = () => {
  const fields = document.querySelectorAll('[data-input]');
  fields.forEach(field => field.value = "")
}

// Limpar antes de atualizar
const clearTable = () => {
  const rows = document.querySelectorAll('.crud-table>tbody tr');
  rows.forEach(row => row.parentElement.removeChild(row))
}


const updateTable = () => {
  const songs = readSong();
  clearTable();
  songs.forEach((song, index) => {
    const newSong = document.createElement('tr');
    newSong.innerHTML = `
      <th>${index+1}</th>
      <th>${song.name}</th>
      <th>${song.artist}</th>
      <th>${song.genre}</th>
      <th><i class="fa-solid fa-pen-to-square edit-song-${index}"></i></th>
      <th><i class="fa-solid fa-trash-can delete-song-${index}"></i></th>
    `
    tableBody.appendChild(newSong);
  });
}
updateTable()

// Editar e Deletar

const editDelete = (event) => {
  if (event.target.classList[0] == 'fa-solid') {
    const [action, , index] = event.target.classList[2].split('-');
    if (action == 'edit') {
      editItem(index);
    } else {
      const response = confirm(`Deseja realmente excluir esta música?`);
      if (response) {
        deleteSong(index);
        updateTable()        
      }
    }
  }
}

const editItem = (index) => {
  const song = readSong()[index]
  song.index = index
  fillFields(song);
  musicName.focus()
}

const fillFields = (song) => {
  musicName.value = song.name;
  artistName.value = song.artist;
  genreName.value = song.genre;
  musicName.dataset.new = song.index;
}



// EVENTOS -------------------------------
btnCreate.addEventListener('click', saveSong);

tableBody.addEventListener('click', editDelete);
