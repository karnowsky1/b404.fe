import { Formik } from 'formik';
import { Input, Form, SubmitButton } from 'formik-antd';
import { Modal } from 'antd';
import React from 'react';
import { required } from '../../utils/validators';

const defaults = {
  name: ''
};

export const CompanyModal = ({
  initialValues = defaults,
  onSubmit,
  onCancel,
  title
}) => (
  <Modal title={title} visible footer={[]} onCancel={onCancel}>
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values)
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
          
          <p>Company Name *</p>
          <Form.Item name="name" validate={required}>
            <Input name="name" placeholder="Company Name" />
          </Form.Item>
          <p></p>
          <SubmitButton>Submit</SubmitButton>
        </Form>
      )}
    </Formik>
  </Modal>
);
