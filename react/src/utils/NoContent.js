import React from 'react';
import { Icon } from 'antd';

export class NoContent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            padding: 11,
            backgroundColor: '#eee',
            border: '#eee solid',
            borderRadius: 5,
          }}
        >
          <Icon
            type={this.props.iconType}
            theme="twoTone"
            twoToneColor={this.props.twoTonecolor}
            style={{
              fontSize: '4.5em',
              width: '100%',
              marginBottom: 12,
              opacity: 0.7,
            }}
          />
          <p
            style={{
              textAlign: 'center',
              fontSize: 14,
              marginBottom: 6,
              fontWeight: 'bold',
            }}
          >
            {this.props.firstMessage}
          </p>
          <p style={{ fontSize: 12, textAlign: 'center' }}>
            {this.props.secondMessage}
          </p>
        </div>
      </React.Fragment>
    );
  }
}
