import React from 'react';
import { Col, Row } from 'react-bootstrap';

function QuestionTab({question,questionIndex}) {
    return (
        <Row>
            <Col className='col-12'>
                <div className="d-flex flex-column gap-2" style={{height:435}}>
                    <div className="h-100 p-3 dark-bg d-flex flex-column align-items-start">
                        <p className='fs-4 fw-semibold border-bottom border-white border-3'>{questionIndex+1}. {question.title}</p>
                        <p className='fs-5'>{question.question}</p>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

export default QuestionTab;