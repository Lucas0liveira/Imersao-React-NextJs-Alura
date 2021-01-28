/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
// import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';
import AlternativesForm from '../src/components/AlternativesForm';

function LoadingWidget() {
  return (
    <Widget
      style={{
        height: '570px',
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Widget.Header />

      <div
        style={{
          width: '100%',
          height: '150px',
          backgroundColor: `${db.theme.colors.secondary}`,
        }}
      />
    </Widget>
  );
}

function ResultWidget({ results }) {
  return (
    <Widget
      style={{
        height: '570px',
      }}
    >
      <Widget.Header>
        <h2>Score Final</h2>
      </Widget.Header>

      <Widget.Content>
        Você acertou
        {' '}
        {results.reduce((somatoriaAtual, resultAtual) => {
          const isAcerto = resultAtual === true;
          if (isAcerto) {
            return somatoriaAtual + 1;
          }
          return somatoriaAtual;
        }, 0)}
        {' '}
        perguntas!
        <ul>
          {results.map((result, index) => (
            <li key={`result_${result}`}>
              {index + 1}
              º Questão:
              {' '}
              {result === true ? 'Acertou' : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question, totalQuestions, questionIndex, onSubmit, addResults,
}) {
  const [selected, setSelected] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const isCorrect = selected === question.answer - 1;

  return (
    <Widget>
      <Widget.Header>
        <h3>
          {' '}
          Pergunta
          {' '}
          {questionIndex + 1}
          {' '}
          de
          {` ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Imagem pergunta"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />

      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(e) => {
            e.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResults(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelected(undefined);
            }, 1.5 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const selectedalternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={alternativeIndex === selected}
                data-status={isQuestionSubmited && selectedalternativeStatus}
              >
                <input
                  disabled={alternativeIndex != selected && alternativeIndex == -1}
                  onChange={() => setSelected(alternativeIndex)}
                  checked={alternativeIndex == selected}
                  style={{ display: 'none' }}
                  id={alternativeId}
                  // name={questionId}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={selected === undefined}>
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}

        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.RESULT);
  const [results, setResults] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResults(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 5 * 1000);
  });

  function handleSubmit() {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>

        { screenState === screenStates.QUIZ && (
        <QuestionWidget
          question={question}
          totalQuestions={totalQuestions}
          questionIndex={questionIndex}
          onSubmit={handleSubmit}
          addResults={addResults}
        />
        )}
        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
