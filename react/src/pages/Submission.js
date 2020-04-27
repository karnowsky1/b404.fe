import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../constants/routes';
import { Card, message, Button, Icon } from 'antd';
import { TOKEN_KEY } from '../constants/auth';

// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { axiosError } from '../utils/axiosError';

import { FormGenerator } from 'cb-react-forms';

import { getFileByID } from '../utils/api';

import * as jsPDF from 'jspdf';

import * as html2canvas from 'html2canvas';

const corruptForm = [{"id":"f6d6f8cb-5d69-4db7-813f-561bc9ea91ba","element":"Header","label":{"blocks":[{"key":"48b1d","text":"THIS FORM FILE IS CORRUPT, PLEASE CHANGE THE FILE ASSOCIATED WITH THIS STEP!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":76,"style":"BOLD"}],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}}}]

function markStepComplete() {
  console.log('COMPLETE');
  const url =
    window.__env__.API_URL +
    '/blink/api/workflow/step/complete?id=' +
    localStorage.getItem('stepId');
  axios
    .put(url, null, {
      headers: {
        Authorization: localStorage.getItem(TOKEN_KEY),
      },
    })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = '/dashboard';
      }
    })
    .catch(axiosError);
}

export default class Submission extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem('stepId') && localStorage.getItem('fileId')) {
      this.state = {
        fileName: '',
        stepId: localStorage.getItem('stepId'),
        fileId: localStorage.getItem('fileId'),
        file: [],
      };
      //localStorage.removeItem('stepId');
      //localStorage.removeItem('fileId');

      console.log(this.state.fileId);
    } else {
      this.state = {
        fileName: '',
        stepId: null,
        fileId: null,
        file: [],
      };
    }
  }

  checkParse(file) {
    if(file) {
      try {
          return JSON.parse(atob(file.split(',')[1]));
      } catch(e) {
          return corruptForm;
      }
    }
  }

  componentDidMount() {
    if (this.state.fileId) {
      getFileByID(this.state.fileId).then((result) => {
        this.setState({
          fileName: result.data.name,
          file: this.checkParse(result.data.file)
        });
      });
    }
  }

  onSubmit = (formData) => {
    this.print();
    //window.print();
  };

  print() {
    const filename = this.state.fileName;

    html2canvas(document.querySelector('.jumbotron'), {}).then((canvas) => {
      let pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 12, 0, 0, 0);
      pdf.save(filename);

      console.log(canvas.toDataURL('image/png'));

      let requestObject = {
        fileID: this.state.fileId,
        name: this.state.fileName,
        file: canvas.toDataURL(), //.toString(),
        form: false,
      };

      console.log(requestObject);

      const url = window.__env__.API_URL + '/blink/api/file';
      axios
        .put(url, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            message.success('Data saved successfully');
            markStepComplete();
          }
        })
        .catch(axiosError);
    });
  }

  render() {
    return (
      <Card title="Form for Submission">
        <div id="form">
          <div>
            <FormGenerator
              onSubmit={this.onSubmit}
              formData={this.state.file}
            />
            <Button
              style={{
                zIndex: '11',
                backgroundColor: '#fafafa!important',
                position: 'relative',
                top: '-13em',
                left: '-3em',
              }}
            >
              <NavLink to={MAIN_ROUTES[0].path}>
                <span>
                  <Icon
                    style={{
                      position: 'relative',
                      top: '-.2em',
                      marginRight: '.5em',
                    }}
                    type={MAIN_ROUTES[0].icon}
                  />
                  {`Back to ${MAIN_ROUTES[0].name}`}
                </span>
              </NavLink>
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}
