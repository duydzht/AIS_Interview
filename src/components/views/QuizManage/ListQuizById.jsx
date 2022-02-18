/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useParams } from 'react-router-dom';
import { apiQuiz } from '../../../api/apiConnect';

export default function ListQuizById() {
    const { id } = useParams();
    const [listQuiz, setListQuiz] = React.useState([]);
    const getListQuizByUser = () => {
        apiQuiz
            .get(`/quiz/all/${id}`)
            .then((res) => {
                setListQuiz(res.data);
            })
            .catch((err) => console.log(err));
    };
    React.useEffect(() => {
        getListQuizByUser();
    }, []);
    console.log(listQuiz);
    const RenderQuiz = () => {
        if (listQuiz.length > 0) {
            return listQuiz.map((quiz) => (
                <div key={quiz.id} className='card__take-test-header row mt-4'>
                    <img src='/images/quiz.png' alt={quiz.description} />
                    <div className=''>
                        <h4 className=''>{quiz.description}</h4>
                        <img
                            src='https://aisolutionsjsc.com/wp-content/uploads/2021/07/logo-ai.png'
                            alt={quiz.description}
                            width='250px'
                        />
                        <p>AI FOR THE BETTER LIFE</p>
                    </div>
                    <p className='text-left'>
                        Time out:{' '}
                        <i className='text-info'>{quiz.quizTime} minutes</i>
                        <br />
                        Quantity question:{' '}
                        <i className='text-info'>{quiz.numberQuestions}</i>
                        <br />
                        {/* <button className='btn btn-info mt-2'>Start</button> */}
                        Status:{' '}
                        {quiz.status === 'not start' ? (
                            <i className='fa fa-times text-danger'>
                                {' '}
                                Not started yet
                            </i>
                        ) : (
                            <i className='fa fa-check text-success'>
                                {' '}
                                Finished
                            </i>
                        )}
                    </p>
                </div>
            ));
        } else return <div>Empty!</div>;
    };
    return (
        <div className='page__out'>
            <div className='page__in'>
                <div className='container card-list-quiz'>
                    <RenderQuiz />
                </div>
            </div>
        </div>
    );
}
