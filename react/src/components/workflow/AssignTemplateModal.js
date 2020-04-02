import { Formik } from 'formik';
import { Form, SubmitButton, Select } from 'formik-antd';
import { Form as AntForm, Modal } from 'antd';
import React from 'react';
import { required } from '../../utils/validators';

const { Option } = Select;

const defaults = {
  templateID: ''
};

const AssignTemplateModalForm = ({
  initialValues = defaults,
  templates,
  onSubmit,
  onCancel,
  title
}) => {
  return (
    <Modal title={title} visible footer={[]} onCancel={onCancel}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          // onSubmit from formik-antd
          onSubmit(values); // onSubmit passed from props
          setSubmitting(false);
        }}
      >
        {({ handleSubmit }) => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <p></p>
            <p>Template Name</p>
            <Form.Item name="templateID" validate={required}>
              <Select
                name="templateID"
                style={{ width: '100%' }}
                placeholder="Select Workflow Template"
              >
                {templates.map(({ value, label }) => (
                  <Option value={value} key={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <p></p>
            <SubmitButton>Next</SubmitButton>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export const AssignTemplateModal = AntForm.create({
  name: 'assign_template_modal'
})(AssignTemplateModalForm);
