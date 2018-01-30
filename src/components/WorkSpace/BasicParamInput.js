/**the basic display for param input*/
import React from 'react';
import {Input, Row, Col} from 'antd';

class BasicParamInput extends React.PureComponent {

    render() {
        const {title, name, validator, type, tip} = this.props;

        let validatefunc = eval(validator)
        console.log(validatefunc("hi") )

        return <div>
                <Row>
                    <Col span={6}> 
                        <span style={{lineHeight: '32px'}}>{title}</span> 
                    </Col>
                    <Col span={18}> <Input placeholder={tip} /> </Col>
                </Row>
            </div>
    }
}

export default BasicParamInput;