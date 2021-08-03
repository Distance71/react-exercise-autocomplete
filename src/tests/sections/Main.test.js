import { createRenderer } from 'react-test-renderer/shallow';
import Main from './Main';

test('renders learn react link', () => {
  const wrapper = createRenderer().render(<Main />);
  expect(wrapper).toMatchSnapshot();
});
