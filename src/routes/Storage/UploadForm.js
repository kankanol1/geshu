import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Upload, Icon, message, Form } from 'antd';
import request from '../../utils/request';
import urls from '../../utils/urlUtils';

const FormItem = Form.Item;

@Form.create()
export default class UploadForm extends PureComponent {
}
