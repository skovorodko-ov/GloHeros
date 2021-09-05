window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // получение элементов со страницы
  const select = document.getElementById('films'),
        cardsContainer = document.querySelector('.cards-container');

  // получение данных от сервера
  const getDataFromServer = () => {
    return fetch('./dbHeroes.json');
  };

  // обработка полученных от сервера данных
  const createData = (response) => {
    const data = JSON.parse(response);
    return data;
  };

  // добавление option в select
  const addOption = (arr) => {
    let movies = [];
    arr.forEach(elem => {
      movies = movies.concat(elem.movies);
    });
    const uniqMovies = Array.from(new Set(movies));
    uniqMovies.forEach(elem => {
      if (elem) {
        const option = document.createElement('option');
        option.classList.add('option');
        option.value = elem;
        option.textContent = elem;
        select.append(option);
      }
    });
    return arr;
  };

  // создание карточки героя
  const creatCard = (element) => {
    const card = document.createElement('div'),
          img = document.createElement('img');
    img.classList.add('imageHero');
    img.src = element.photo;
    img.alt = element.name;
    img.onerror = () => {img.src = './image/notFound-removebg-preview.png';};
    card.classList.add('card');
    card.innerHTML = `
      <div class="hero-info">
        <h3>${element.name ? element.name : 'unknown'}</h3>
        <div class="character">
          <span class="characteristic">Real-name: </span>
          <span class="text">${element.realName ? element.realName : 'unknown'}</span>
        </div>
        <div class="character">
          <span class="characteristic">Movies: </span>
          <span class="text">${element.movies ? element.movies.join(', ') : 'unknown'}</span>
        </div>
        <div class="character">
          <span class="characteristic">Status: </span>
          <span class="text">${element.status ? element.status : 'unknown'}</span>
        </div>
      </div>
    `;
    cardsContainer.append(card);
    card.prepend(img);
  };

  // добавление всех карточек на страницу по дефолту
  const addCards = (heros) => {
    heros.forEach(elem => {
      creatCard(elem);
    });
    return heros;
  };

  // выбор персонажей конкретного фильма
  const checkingHeroFromMovie = (heros) => {
    select.addEventListener('change', e => {
      cardsContainer.innerHTML = '';
      heros.forEach(elem => {
        if (elem.movies && elem.movies.includes(e.target.value)) {
          creatCard(elem);
        }
      });
      if (!e.target.value) {
        addCards(heros);
      }
    });
  };

  // логика выполнения скрипта
  getDataFromServer()
    .then(response => {
      if (response.status !== 200) {
        throw new Error('status networn not 200');
      }
      return response.text();
    })
    .then(createData)
    .then(addOption)
    .then(addCards)
    .then(checkingHeroFromMovie)
    .catch(error => {
      console.warn(error);
      cardsContainer.style.background = `no-repeat center url(./image/notFound-removebg-preview.png) 
      rgba(240, 237, 237, 0.15)`;
    });
});


