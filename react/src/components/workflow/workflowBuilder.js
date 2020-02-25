import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath  }  from 'react-sortable-tree';
import { 
    Button,
    Input } from 'antd';
import 'react-sortable-tree/style.css';

export default class WorkflowBuilder extends Component {

    constructor(props) {
        super(props);
        this.updateTreeData = this.updateTreeData.bind(this);
        this.addNode = this.addNewNode.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.state = {
            treeData: [{
                title: 'TITLE',
            }]
        };
    }
    addNewNode(rowInfo) {
        const NEW_NODE = { title: 'STEP', isDirectory: true, expanded: true };
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
        this.updateTreeData(newTree);
      }
    
    updateTreeData(treeData) {
        this.setState({ treeData });
    }
    
    render() {
        const getNodeKey = ({ treeIndex }) => treeIndex;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <SortableTree
                         treeData={this.state.treeData}
                         onChange={this.updateTreeData}
                         generateNodeProps={rowInfo => ({
                        title: (
                        <Input
                         style={{ fontSize: '1.1rem' }}
                         value={rowInfo.node.title}
                         onChange={event => {
                         const { path } = rowInfo;
                         const title = event.target.value;

                            this.setState(state => ({
                            treeData: changeNodeAtPath({
                            treeData: state.treeData,
                            path,
                            getNodeKey,
                            newNode: { ...rowInfo.node, title },
                            }),
                            }));
                            }}
                            />
                             ),
                             buttons: [
                                      <div>
                                       <Button label='Delete'
                                               onClick={(event) => this.removeNode(rowInfo)}>Remove</Button>
                                       <Button label='Add'
                                               onClick={(event) => this.addNewNode(rowInfo)}>Add</Button>
                                       </div>,
                                    ],
                             style: {
                                      height: '50px',
                                    }
                          })}
                />
            </div>
        );
    }
}