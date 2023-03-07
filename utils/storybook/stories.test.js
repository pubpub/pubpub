/**
 * @jest-environment jsdom
 */
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import initStoryShots, { renderWithOptions } from '@storybook/addon-storyshots';

Enzyme.configure({ adapter: new Adapter() });

initStoryShots({ test: renderWithOptions({ renderer: mount }) });
