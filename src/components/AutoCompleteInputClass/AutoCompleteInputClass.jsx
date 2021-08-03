import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { debounce } from '../../lib/utils';

const DEBOUNCE_TIMEOUT = 500;
const ITEM_HEIGHT = 20;
const ITEMS_PAGE = 100;

const styles = {
  container: {
    width: '60%',
    height: '50vh',
    position: 'relative',
    background: '#fafafa',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  listWrapper: {
    top: '20%',
    width: '50%',
    bottom: 0,
    overflowY: 'auto',
    position: 'absolute',
  },
  list: (height) => ({
    height,
    position: 'relative',
  }),
  listItem: (top) => ({
    height: '10px',
    padding: '10px',
    left: 0,
    right: 0,
    top: top + 'px',
    position: 'relative',
    color: 'black',
    fontSize: '0.7rem',
  }),
  input: {
    height: '10%',
    width: '50%'
  },
}

// TO Fix: It may fail when an user scroll faster. Would be ok to add a loader
class AutoCompleteInputClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: 0,
      scrollPos: 0,
      elementsHeight: {},
      showOptions: false,
      listHeight: 0,
    };
    this.listWrapperRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
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

  handleScroll() {
    const scrollPos = this.listWrapperRef?.current?.scrollTop;
    this.setState({ scrollPos })
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    if (prevProps.options.length !== options.length) {
      this.setItemsHeight(options);
    }
  }

  handleChange (e) {
    const { onChange } = this.props;
    debounce(() => {
      onChange(e.target.value)
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

  showOptions() {
    this.setState({ showOptions: !this.state.showOptions })
  }

  itemRenderer({
    id, 
    name,
  }) {
    const top = this.state.elementsHeight[id];
    return (
      <div key={id} style={styles.listItem({ top })}> 
        {name}
      </div>
    );
  }

  render() {
    const { placeholder, options } = this.props;
    const { showOptions } = this.state;

    return (
      <div style={styles.container}>
        <input 
          type="text" 
          style={styles.input}
          placeholder={placeholder} 
          onFocus={this.showOptions}
          onBlur={this.showOptions}
          onChange={this.handleChange} />
        <div 
          style={styles.listWrapper} 
          ref={this.listWrapperRef}
          onScroll={this.handleScroll}
        >
          <div style={styles.list(this.state.listHeight)}>
          {showOptions && options.map(item => {
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
