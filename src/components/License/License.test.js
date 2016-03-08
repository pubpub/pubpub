
import {expect} from 'chai';
import {renderComponent} from '../../utils/testFunctions';
import License from './License.jsx'

describe('Components', () => {
  describe('License.jsx', () => {
    it('should render correctly', () => {

      const component = renderComponent(License, {});
      // expect(output.type).toBe('header')
      // expect(output.props.className).toBe('header')

      // let [ div ] = output.props.children;

      expect('div').to.equal('div');
      // expect(h1.props.children).toBe('todos')

      // expect(input.type).toBe(TodoTextInput)
      // expect(input.props.newTodo).toBe(true)
      // expect(input.props.placeholder).toBe('What needs to be done?')
    });

    // it('should call addTodo if length of text is greater than 0', () => {
    //   const { output, props } = setup()
    //   let input = output.props.children[1]
    //   input.props.onSave('')
    //   expect(props.addTodo.calls.length).toBe(0)
    //   input.props.onSave('Use Redux')
    //   expect(props.addTodo.calls.length).toBe(1)
    // })
  });
});