import React, { Component } from 'react'
import { Card } from 'antd'
import { TOKEN_KEY } from '../constants/auth';
// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { axiosError } from '../utils/axiosError';

import { FormGenerator } from 'cb-react-forms';

const onSubmit = (formData) => {
  window.print();
  markStepComplete();
}

function markStepComplete() {
  console.log('COMPLETE')
  const url =
    window.__env__.API_URL +
    '/blink/api/workflow/step/complete?id=' +
    localStorage.getItem('stepId');
  axios
    .put(url, null, {
      headers: {
        Authorization: localStorage.getItem(TOKEN_KEY)
      }
    })
    .then(response => {
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
        stepId: localStorage.getItem('stepId'),
        fileId: localStorage.getItem('fileId')
      };
      //localStorage.removeItem('stepId');
      //localStorage.removeItem('fileId');

      console.log(this.state.fileId);
    } else {
      this.state = {
        stepId: null,
        fileId: null
      };
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <Card title="Form for Submission">
        <FormGenerator onSubmit={onSubmit} formData={[{"id":"c27d1349-b643-49e0-9716-34208cf10a07","element":"Header","label":{"blocks":[{"key":"4hb8o","text":"THIS FORM IS FOR DEMO PURPOSES","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":30,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}},{"id":"913cc512-47f2-48a1-a0cd-26fde8486976","element":"Paragraph","label":{"blocks":[{"key":"14cdp","text":"Write something here...","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}},{"id":"fb004797-2a24-41ba-97de-bb34200c64f7","element":"LineBreak"},{"id":"1fa1ad35-7191-4b58-adf5-0eb15680d796","element":"Dropdown","label":{"blocks":[{"key":"6kj5h","text":"Select an option","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"required":true,"options":[{"id":"05e40ed7-2db9-44fb-8b26-dd346563f169","value":"Demo option 1"},{"id":"11972896-e27c-4ed5-8e5f-e71b59e2b9f2","value":"Demo option 2"}]},{"id":"8669bae8-4912-4841-b867-ec00cf2b7a49","element":"Checkboxes","label":{"blocks":[{"key":"as8i","text":"Demo Checkbox","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"required":false,"options":[{"id":"59ecc0b6-5376-4a1e-9827-e2951afa004d","value":"Option1","checked":false},{"id":"aaacb55d-db5a-480c-baad-8e387b7cf059","value":"Option2","checked":false}]},{"id":"a600f158-7d53-4760-8b9d-020f11d432fe","element":"Paragraph","label":{"blocks":[{"key":"43sgm","text":"We hope you enjoyed it!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}}]}/>
      </Card>
    )
  }
}
