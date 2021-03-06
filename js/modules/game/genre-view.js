import AbstractView from '../view';
import initializePlayer from '../../player';

export default class GenreView extends AbstractView {
  constructor(quest) {
    super();
    this.quest = quest;
  }

  get template() {
    return `
<section class="main main--level main--level-genre">
  <h2 class="title">${this.quest.question}</h2>
  <form class="genre">
    ${this.quest.answers.map((answer, i) => `
      <div class="genre-answer">
      <div class="player-wrapper"></div>
        <input type="checkbox" name="answer" value="${answer.genre}" id="${i}-${answer.genre}">
        <label ${this.quest.genre === answer.genre ? `style="background-color: red"` : ``} class="genre-answer-check" for="${i}-${answer.genre}"></label>
      </div>
      `).join(``)}
    <button class="genre-answer-send" type="submit">Ответить</button>
  </form>
</section>`.trim();
  }

  bind() {
    const inputs = this.element.querySelectorAll(`input[type="checkbox"]`);
    const sendAnswer = this.element.querySelector(`.genre-answer-send`);
    const players = this.element.querySelectorAll(`.player-wrapper`);
    const audio = [];
    sendAnswer.disabled = true;

    Array.from(players).forEach((player, i) => audio.push(initializePlayer(player, this.quest.answers[i].src)));

    inputs.forEach((input) => {
      input.onchange = () => {
        sendAnswer.disabled = !input.checked;
      };
    });

    sendAnswer.onclick = () => {
      const getAnswers = () => {
        return Array.from(inputs).filter((input) => {
          return input.checked;
        }).map((input) => {
          return input.value;
        });
      };

      const answers = getAnswers();

      inputs.forEach((input) => {
        input.checked = false;
      });

      sendAnswer.disabled = true;

      audio.forEach((destroyAudio) => destroyAudio());

      this.onClick(answers);
    };
  }

  onClick(answer) {

  }

}
