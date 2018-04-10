

// import React from 'react';
// import { Modal, Button, Input, Spin, Icon } from 'antd';

// export default class SelectFile extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       formData: { ...props.formData },
//       loading: true,
//       listData: undefined,
//       modal: false,
//       path: undefined,
//       select: undefined,
//     };
//     this.openSelectModel = this.openSelectModel.bind(this);
//     this.select = this.select.bind(this);
//     this.handleOk = this.handleOk.bind(this);
//     this.requestList = this.requestList.bind(this);
//     this.fileHaveName = this.fileHaveName.bind(this);
//   }
//   componentWillMount() {
//     // const { url } = this.props.uiSchema['ui:options'];
//     // const url = '/api/component/sample';
//     // fetch(url).then(results => results.json())
//     //   .then(result => this.setState({ loading: false, listData: result }));
//   }
//   onChange(event) {
//     this.setState({
//       formData: {
//         value: event.target.value,
//       },
//     }, () => this.props.onChange(this.state.formData));
//   }
//   fileHaveName(path) {
//     const nameArr = path.split('/');
//     return nameArr[nameArr.length-1];
//   }
//   requestList(path, index, data) {
//     const url = this.props.uiSchema['ui:options'];
//     const urls = `${url}?path=${path}`;
//     let listData = [];
//     fetch(urls).then(results => results.json())
//       .then((result) => {
//         if (!data) {
//           listData = result;
//           for (let i = 0; i < listData.length; i++) {
//             listData[i].name = this.fileHaveName(listData[i].path);
//           }
//           this.setState({ loading: false, listData: listData });
//         } else {
//           const datas = data;
//           listData = result;
//           for (let i = 0; i < listData.length; i++) {
//             listData[i].name = this.fileHaveName(listData[i].path);
//           }
//           datas[index].child = listData;
//           this.setState({ loading: false, listData: datas });
//         }
//       });
//   }
//   openSelectModel() {
//     this.setState({ modal: true });
//     this.requestList('/');
//   }
//   select(e, path, isdir, index) {
//     e.preventDefault();
//     e.stopPropagation();
//     if (isdir) {
//       this.setState({ loading: true });
//       this.requestList(path, index, this.state.listData);
//     } else {
//       this.setState({ select: path });
//     }
//   }
//   handleOk() {
//     this.setState({ modal: false });
//     this.setState({ path: this.state.select });
//   }

//   render() {
//     const { value } = this.state;
//     console.log('sample, props', this.props);
//     return (
//       <div><span>文件路径</span>
//         <Input value={this.state.path} />
//         <Button type="primary" size="small" onClick={this.openSelectModel}>选择文件</Button>
//         <Modal
//           title="选择文件"
//           visible={this.state.modal}
//           onOk={this.handleOk}
//           onCancel={() => { this.setState({ modal: false }); }}
//         >
//           {
//             this.state.loading ? <Spin /> :
//             (this.state.listData.map(
//               (list, index) =>
//                 <div key={list.path}
//                   onClick={(e) => { this.select(e, list.path, list.isdir, index); }}>
//                   <Icon type={list.isdir ? 'file' : 'file-text'} />{list.name}
//                   {
//                     list.child ? list.child.map(
//                     (lists, index) => <p key={lists.path}
//                      onClick={(e) => { this.select(e, lists.path, lists.isdir, index); }}>
//                       <Icon type={lists.isdir ? 'file' : 'file-text'} />
//                       {lists.name}
//                     </p>) : null
//                   }
//                 </div>
//             ))
//          }
//         </Modal>
//       </div>
//     );
//   }
// }
