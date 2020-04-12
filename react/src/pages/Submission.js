import React, { Component } from 'react'
import { Card } from 'antd'

import { FormGenerator } from 'cb-react-forms';

const onSubmit = (formData) => {
  window.print()
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
        <FormGenerator onSubmit={onSubmit} formData={[{"id":"482795fa-54fe-48ad-99bd-ae7f49f7d4cd","element":"Header","label":{"blocks":[{"key":"9ntrh","text":"Test form","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}},{"id":"42db563d-b02c-4f58-898c-17b6ddcf26b5","element":"Paragraph","label":{"blocks":[{"key":"9ghnq","text":"This is a nice form, please fill it.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}},{"id":"89b3d66b-1fd9-4b39-b58d-bf95f4309801","element":"Dropdown","label":{"blocks":[{"key":"3hn48","text":"Nice","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"required":true,"options":[{"id":"58743254-91b7-4523-9487-1a416319e3a4","value":"Yup"},{"id":"eb2efe51-0360-4ca0-9b5d-51dfc82acbc2","value":"Nope"}]},{"id":"a3085f79-657b-4132-ac82-0cd2383f8a3b","element":"TextInput","required":true,"label":{"blocks":[{"key":"9tvr0","text":"Did you rike it?","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}},"value":""}]}/>
      </Card>
    )
  }
}
