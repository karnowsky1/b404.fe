import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath  }  from 'react-sortable-tree';
import { 
    Button,
    Input,
    Select,
    message } from 'antd';
import 'react-sortable-tree/style.css';
//import qs from 'qs';
import axios from 'axios';
import { TOKEN_KEY/*, UUID_KEY*/ } from '../../constants/auth'

const { Option } = Select;

export default class WorkflowBuilder extends Component {

    constructor(props) {
        super(props);
        this.updateTreeData = this.updateTreeData.bind(this);
        this.addNode = this.addNewNode.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            wfName: '',
            wfDescription: '',
            loading: false,
            verbs: [],
            treeData: [{
                title: 1,
                subtitle: 'Insert description here',
                expanded: false
            }]
        };

        const url = window.__env__.API_URL + '/blink/api/verb/';
        axios.get(
        url,
        {
            headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : localStorage.getItem(TOKEN_KEY)
            }
        }
        ).then(response => {
        if (response.status === 200){
            this.setState({
            verbs: response.data,
            treeData: [{
                title: response.data[0].verbID,
                subtitle: 'Insert description here',
                expanded: false
            }]
            })
        }
        }).catch(function (error) {
        message.destroy()
        if (error.response) {
            // Request made and server responded
            message.error(error.response.data.error);
        } else if (error.request) {
            // The request was made but no response was received
            message.error("Server not responding");
        } else {
            // Something happened in setting up the request that triggered an Error
            message.error("Error setting up request");
        }
        });
    }

    handleSubmit = async e => {
        e.preventDefault();
        //const {wfName, username, password, fName, lName, email, title, accessLevelID} = this.state.user
        //const id = UUID
        //const url = window.__env__.API_URL + '/blink/api/workflow'
        const requestObject = {
            name: this.state.wfName.text,
            description: this.state.wfDescription.text,
            steps: this.state.treeData
        }
        this.setState({ loading: true });
        console.log(requestObject);
        /**
        axios.post(
            url,
            requestObject,
            {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : localStorage.getItem(TOKEN_KEY)
            }
            }
        ).then(response => {
            //this.setState({ loading: true });
            if (response.status === 200){
            //this.setState({ loading: false });
            message.success('Data saved successfully');
            }
        }).catch(function (error) {
            message.destroy()
            this.setState({ loading: false });
            if (error.response) {
            // Request made and server responded
            message.error(error.response.data.error);
            } else if (error.request) {
            // The request was made but no response was received
            message.error("Server not responding");
            } else {
            // Something happened in setting up the request that triggered an Error
            message.error("Error setting up request");
            }
        });*/
      };

    addNewNode(rowInfo) {
        const NEW_NODE = { title: this.state.verbs[0].verbID, subtitle: 'Insert description here...'};
        const newTree = addNodeUnderParent({
          treeData: this.state.treeData,
          newNode: NEW_NODE,
          expandParent: true,
          parentKey: rowInfo ? rowInfo.treeIndex : undefined,
          getNodeKey: ({ treeIndex }) => treeIndex,
        });
        this.updateTreeData(newTree.treeData);
      }
    
      removeNode(rowInfo) {
        const { path } = rowInfo;
        const newTree = removeNodeAtPath({
            treeData: this.state.treeData,
            path,
            getNodeKey: ({ treeIndex }) => treeIndex,
            });
            if(newTree.length !== 0) {
                this.updateTreeData(newTree);
            }
      }
    
    updateTreeData(treeData) {
        this.setState({ treeData });
        //console.log(this.state)
    }
    
    render() {
        const getNodeKey = ({ treeIndex }) => treeIndex;
        const children = [];
            this.state.verbs.forEach(element => {
                children.push(<Option key={element.verbID}>{element.description}</Option>);
            });
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'row', marginRight: '35px'}}> 
                <h3 style={{margin: '0'}}>Name: </h3>
                <Input size="small" onChange={event => {
                                const text = event.target.value;
                                this.setState({
                                    wfName: {text}
                                  });
                                }} 
                placeholder="Enter workflow name..." >
                </Input>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                <h3 style={{margin: '0'}}>Description: </h3>
                <Input size="small" onChange={event => {
                                const text = event.target.value;
                                this.setState({
                                    wfDescription: {text}
                                  });
                                }} 
                placeholder="Enter workflow description..." >
                </Input>
                </div>
                </div>
                <SortableTree
                         treeData={this.state.treeData}
                         onChange={this.updateTreeData}
                         generateNodeProps={rowInfo => ({
                         title: (
                            <Select defaultValue="1" size="small" style={{ width: 120 }} onChange={event => {
                                const { path } = rowInfo;
                                const title = parseInt(event);
                                   this.setState(state => ({
                                   treeData: changeNodeAtPath({
                                   treeData: state.treeData,
                                   path,
                                   getNodeKey,
                                   newNode: { ...rowInfo.node, title },
                                   }),
                                   }));
                                   }}>
                            {children}
                            </Select>
                             ),
                            subtitle: (
                            <Input
                            style={{ marginTop: '12px' }}
                            value={rowInfo.node.subtitle}
                            size="small"
                            onChange={event => {
                            const { path } = rowInfo;
                            const subtitle = event.target.value;
    
                                this.setState(state => ({
                                treeData: changeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                                newNode: { ...rowInfo.node, subtitle },
                                }),
                                }));
                                }}
                                />
                                ),
                             buttons: [
                                      <div>
                                       <Button label='Delete'
                                            onClick={(event) => this.removeNode(rowInfo)}>Remove
                                        </Button>
                                       <Button label='Add'
                                            onClick={(event) => this.addNewNode(rowInfo)}>Add
                                        </Button>
                                       </div>,
                                    ],
                             style: {
                                      height: '50px',
                                    }
                          })}>
                </SortableTree>
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '-60px' }}>
                <Button type="primary" loading={this.state.loading} label='submit' onClick={this.handleSubmit}>
                    Submit
                </Button>
                </div>
            </div>
        );
    }
}