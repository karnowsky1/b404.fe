import { Formik } from 'formik';
import { Input, Form, SubmitButton, Select } from 'formik-antd';
import { Form as AntForm, Modal } from 'antd'
import React from 'react';
import { required } from '../../utils/validators';
import { DateRange } from '../../utils/DateRange';

const { Option } = Select;

const defaults = {
  name: '',
  description: '',
  startDate: '',
  deliveryDate: '',
  company: undefined,
  accessLevelID: ''
}

const MilestoneModalForm = ({
  initialValues = defaults,
  onSubmit,
  onCancel,
  companies,
  title,
  isAddModal,
  form
}) => (
  <Modal title={title} visible footer={[]} onCancel={onCancel}>
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => { // onSubmit from formik-antd
        onSubmit(values) // onSubmit passed from props 
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
          <p>Name *</p>
          <Form.Item name="name" validate={required}>
            <Input name="name" placeholder="Milestone 1" />
          </Form.Item>
          <p></p>
          <p>Description *</p>
          <Form.Item name="description">
            <Input name="description" placeholder="Milestone Description" />
          </Form.Item>
          <p></p>
          <p>Company</p>
          {/* //////////////////////////////////////////////////// */}
          <Select
            // mode="multiple"
            name="company"
            style={{ width: '100%' }}
            placeholder="Select Company"
            defaultValue={initialValues.company}
            validate={required}
          >
            {/* { console.log(companies)} */}
            {/* {console.log(initialValues.company)} */}


            {companies.map(({ value, label }) => (
               <Option value={value} key={value}> 
                {label} 
               </Option> 
            ))}
          </Select>
          {/* //////////////////////////////////////////////////// */}
          <p></p>
          <DateRange></DateRange>
          <p></p>
          <SubmitButton>Submit</SubmitButton>
        </Form>
      )}
    </Formik>
  </Modal>
);

export const MilestoneModal = AntForm.create({ name: 'milestone_modal' })(MilestoneModalForm)