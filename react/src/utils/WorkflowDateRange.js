import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export class WorkflowDateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endOpen: false,
    };
  }

  onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  render() {
    return (
      <RangePicker
        value={this.props.defaultRange}
        ranges={{
          Today: [moment(), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
        }}
        showTime
        separator="→"
        format={this.props.format}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
      />
    );
  }
}
