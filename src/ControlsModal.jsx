import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from "reactstrap";

class ControlsModal extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className="ControlsModal"
      >
        <ModalHeader toggle={this.props.toggle}>Controls</ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Button</th>
                <th>Player 1</th>
                <th>Player 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Left</td>
                <td>A</td>
                <td>Num-4</td>
              </tr>
              <tr>
                <td>Right</td>
                <td>D</td>
                <td>Num-6</td>
              </tr>
              <tr>
                <td>Up</td>
                <td>W</td>
                <td>Num-8</td>
              </tr>
              <tr>
                <td>Down</td>
                <td>S</td>
                <td>Num-2</td>
              </tr>
              <tr>
                <td>A</td>
                <td>J</td>
                <td>Num-7</td>
              </tr>
              <tr>
                <td>B</td>
                <td>K</td>
                <td>Num-9</td>
              </tr>
              <tr>
                <td>Start</td>
                <td>Enter</td>
                <td>Num-1</td>
              </tr>
              <tr>
                <td>Select</td>
                <td>Ctrl</td>
                <td>Num-3</td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button outline color="primary" onClick={this.props.toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ControlsModal;
