(() => {
  const deleyTime = 4000;
  let numberCards = [];
  let cardArr = [];
  let widthCard = 50;
  let gapList = 10;

  //создание формы
  function createFormChoice() {
    const form = document.createElement('form');
    const inputWrapper = document.createElement('div')
    const inputVert = document.createElement('input');
    const inputHoriz = document.createElement('input');
    const button = document.createElement('button');

    inputVert.setAttribute('type', 'number');
    inputHoriz.setAttribute('type', 'number');
    button.setAttribute('type', 'submit');

    form.classList.add('form-card');
    inputWrapper.classList.add('form-card__input-wrapper')
    inputVert.classList.add('form-card__input');
    inputHoriz.classList.add('form-card__input');
    button.classList.add('form-card__btn');

    inputHoriz.placeholder = 'Число карт по горизонтали'
    inputVert.placeholder = 'Число карт по вертикали'
    button.textContent = 'Начать игру!';

    inputWrapper.append(inputHoriz);
    inputWrapper.append(inputVert);
    form.append(inputWrapper);
    form.append(button);

    return {
      form,
      inputVert,
      inputHoriz,
      button,
    }
  }

  //создание списка с карточками
  function createListCards() {
    const listCard = document.createElement('ul');
    listCard.classList.add('list-card', 'list-reset');
    return listCard;
  }

  //создание карточки
  let hasFlipCard = false;
  let lockTable = false;
  let firstCard,secondaryCard;

  function createCard(obj) {
    //создание элементов
    const card = document.createElement('li');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');
    const cardValue = document.createElement('span');

    //Добавление классов карточкам
    card.classList.add('item-card');
    cardFront.classList.add('item-card__front');
    cardBack.classList.add('item-card__back');
    cardValue.classList.add('item-card__value');

    cardValue.textContent = obj.name;


    //Показ всех карточкек в начале игры
    function showCard() {
      setTimeout(()=>{
        card.classList.add('item-card--active');
      }, 300);
      setTimeout(()=>{
        card.classList.remove('item-card--active');
      }, deleyTime);
    };
    showCard();

    //Сравнение карточек
    function flipCard() {

      if (lockTable) return;
      if (this === firstCard) return;

      this.classList.add('item-card--active');

      if (!hasFlipCard) {
        hasFlipCard = true;
        firstCard = this;
        return hasFlipCard;
      }

      secondaryCard = this;

      checkValueCard();
    }

    function checkValueCard() {
      if (firstCard.textContent === secondaryCard.textContent) {
        disableCard();
        return
      }

      unflipCards();
    }

    function disableCard() {
      firstCard.removeEventListener('click', flipCard);
      secondaryCard.removeEventListener('click', flipCard);

      resetTable();
    }

    function unflipCards() {
      lockTable = true;

      setTimeout(() => {
        firstCard.classList.remove('item-card--active');
        secondaryCard.classList.remove('item-card--active');

        resetTable();
      }, 1000)
    }

    function resetTable() {
      [lockTable, hasFlipCard] = [false, false];
      [firstCard, secondaryCard] = [null, null];
    }

    //Нажатие на карточку
    card.addEventListener('click', flipCard);

    //Добавление элементов в li(карточку)
    cardBack.append(cardValue);
    card.append(cardFront);
    card.append(cardBack);

    //возвращаем объект
    return{
      card,
      cardValue,
    }
  }

  //Перемешивание массива с числами
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

      //поменять элементы местами
      //используем для этого синтаксис "деструктурирующее присваивание"
      [array[i], array[j]] = [array[j], array[i]];
    };
  };

  function beginNewGame() {
    const wrapper = document.createElement('div');
    const descr = document.createElement('p');
    const buttonNewGame = document.createElement('button')

    wrapper.classList.add('request');
    descr.classList.add('request__descr');
    buttonNewGame.classList.add('request__btn');

    descr.textContent = 'Конец игры!';
    buttonNewGame.textContent = 'Начать заново';

    wrapper.append(descr);
    wrapper.append(buttonNewGame);

    return {
      wrapper,
      buttonNewGame,
    }
  };

  function timer(sec) {
    const timeWrapper = document.createElement('div');
    const time = document.createElement('span');
    let intervalId;

    timeWrapper.classList.add('time__wrapper');
    time.classList.add('time__value');

    timeWrapper.textContent = 'Осталось времени:'
    time.textContent = sec / 1000;

    //Начало счетчика (конца игры) с задержкой 4 секунды
    setTimeout(() => {
      intervalId = setInterval(() => {
        if (parseInt(time.textContent) > 0) {
          time.textContent -= 1;
          return
        } else clearInterval(intervalId);
      }, 1000)
    }, deleyTime);

    timeWrapper.append(time);

    return timeWrapper;
  }

  function createAppGame() {
    let container = document.querySelector('.container');

    let listCard = createListCards();
    let formChoice = createFormChoice();
    let timerId;

    container.append(formChoice.form);

    //Получаем количество карт в игре
    formChoice.button.addEventListener('click', (e) => {
      e.preventDefault();

      clearTimeout(timerId);

      //Количество карточек по горизонтали и вертикали
      numberCards.push(formChoice.inputHoriz.value);
      numberCards.push(formChoice.inputVert.value);

      formChoice.form.classList.add('form-card--disabled');

      for (let i = 0; i < numberCards.length; i++) {
        if (!(numberCards[i] % 2 === 0 && numberCards[i] >= 2 && numberCards[i]<= 10)) {
          numberCards.splice([i], 1, '4');
        }
      }

      // Завершение игры с установленным временем
      const valueTime = 60000;
      const timerApp = timer(valueTime);

      timerId = setTimeout(() => {
        createAppCard(numberCards);
        container.append(timerApp)
      });

      setTimeout(() => {
        clearTimeout(timerId);
        listCard.remove();
        timerApp.remove();
        let newGame = beginNewGame();
        container.append(newGame.wrapper);
        newGame.buttonNewGame.addEventListener('click', () => {
          createAppGame();
          newGame.wrapper.remove();
        })
      }, valueTime + deleyTime);
    })

    function createAppCard(array) {
      let arrayValueCars = [];
      //Общее колличество карт
      let sumCard = array[0] * array[1];
      //Вычисление ширины
      let widthListCard = (array[0] * widthCard) + ((array[0] - 1) * gapList);
      listCard.style.width = widthListCard + 'px';

      container.append(listCard);

      //Массив с парой чисел
      for (let i = 0; i < sumCard / 2; i++) {
        arrayValueCars.push(i)
        arrayValueCars.push(i)
      };

      shuffle(arrayValueCars);

      for (let i = 0; i < sumCard; i++) {
        let itemCard = {
          name,
          state: false,
        }

        itemCard.name = arrayValueCars[i];
        let cardObj = createCard(itemCard);
        listCard.append(cardObj.card);
        cardArr.push(itemCard);
      };
    };
  };
  createAppGame();

})();

