import React from 'react';
import { Col, Row } from 'react-bootstrap';
import TutorialPopup from '../TutorialPopup';

function QuestionTab({question,questionIndex}) {
    return (
        <Row className='w-100'>
            <Col className='col-12'>
                <div className="d-flex flex-column gap-2" style={{height:435}}>
                    <div className="tutorial-popup-container h-100 p-3 d-flex flex-column align-items-center">
                        <div className='w-100'>
                            <p className='fs-4 fw-semibold border-bottom border-white border-3'>{questionIndex+1}. {question.title}</p>
                            <p className='fs-5'>{question.question}</p>
                        </div>
                        <TutorialPopup text={"Current Question"} position='top'/>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

export default QuestionTab;