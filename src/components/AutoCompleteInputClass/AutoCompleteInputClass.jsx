import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { debounce } from '../../lib/utils';

const DEBOUNCE_TIMEOUT = 500;
const ITEM_HEIGHT = 20;
const ITEMS_PAGE = 300;

const styles = {
  container: {
    width: '60%',
    height: '50vh',
    position: 'relative',
    background: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  listWrapper: {
    top: '12%',
    width: '52%',
    bottom: 0,
    overflowY: 'auto',
    position: 'absolute',    
  },
  list: (height) => ({
    height,
  }),
  listItem: (top) => ({
    height: '10px',
    padding: '10px 2px',
    backgroundColor: 'white',
    border: '1px solid black',
    top: top + 'px',
    position: 'relative',
    color: 'black',
    fontSize: '0.5rem',
  }),
  input: {
    height: '5vh',
    width: '50%'
  },
}

// TO Fix: It may fail when an user scroll faster. Would be ok to add a loader
// TO Fix: It fails when the user scrolls down after a high index
class AutoCompleteInputClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: 0,
      scrollPos: 0,
      elementsHeight: {},
      areOptionsShown: false,
      listHeight: 0,
      name: '',
    };
    this.listWrapperRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const { options } = this.props;

    const visibleHeight = parseFloat(
      window
        .getComputedStyle(ReactDOM.findDOMNode(this.listWrapperRef.current), null)
        .getPropertyValue('height')
    );

    this.setState({ visibleHeight });

    this.setItemsHeight(options);
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    if (prevProps.options.length !== options.length) {
      this.setItemsHeight(options);
    }
  }

  setItemsHeight(options) {
    let listHeight = 0;

    const elementsHeight = options.reduce((acc, val) => {
      acc[val.id] = listHeight;
      listHeight += ITEM_HEIGHT;
      return acc;
    }, {});

    this.setState({ elementsHeight, listHeight })
  }

  handleScroll() {
    const scrollPos = this.listWrapperRef?.current?.scrollTop;
    this.setState({ scrollPos })
  }

  handleChange(e) {
    const { onChange } = this.props;

    this.setState({ name: e.target.value || e.target.outerText });

    debounce(() => {
      onChange(e.target.value || e.target.outerText)
    }, DEBOUNCE_TIMEOUT);
  }

  checkItemVisibility(id) {
    const elemPosition = this.state.elementsHeight[id];

    return (
      elemPosition >
      this.state.scrollPos -
      ITEMS_PAGE * ITEM_HEIGHT &&
      elemPosition <
      this.state.scrollPos +
      this.state.visibleHeight +
      ITEMS_PAGE * ITEM_HEIGHT
    );
  }

  onFocus() {
    this.setState({ areOptionsShown: true });
  }

  onBlur() {
    this.setState({ areOptionsShown: false });
  }

  itemRenderer({
    id, 
    name,
  }) {
    
    const top = this.state.elementsHeight[id];
    return (
      <div key={id} onMouseDown={this.handleChange} style={styles.listItem({ top })}> 
        {name}
      </div>
    );
  }

  render() {
    const { placeholder, options } = this.props;
    const { areOptionsShown, name } = this.state;

    return (
      <div style={styles.container}>
        <input 
          type="text" 
          style={styles.input}
          placeholder={placeholder} 
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.handleChange}
          value={name}
        />
        <div 
          style={styles.listWrapper} 
          ref={this.listWrapperRef}
          onScroll={this.handleScroll}
        >
          <div style={styles.list(this.state.listHeight)}>
          {areOptionsShown && options.map(item => {
            return (this.checkItemVisibility(item.id)
            && this.itemRenderer(item))
          })}
          </div>
        </div>
      </div>
    )
  }
}

AutoCompleteInputClass.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

AutoCompleteInputClass.defaultProps = {
  options: [],
  placeholder: '',
};

export default AutoCompleteInputClass;
