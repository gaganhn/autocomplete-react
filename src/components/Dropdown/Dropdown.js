import React, { Component } from "react";
import debounceFunction from "../../utils/debounce";
import { ReactComponent as ArrowDown } from "./arrowDown.svg";
import { ReactComponent as ArrowUp } from "./arrowUp.svg";
import { ReactComponent as Check } from "./check.svg";
import "./Dropdown.css";

class Dropdown extends Component {

  constructor(props) {
    super(props);
    const { title, list, searchHandler } = this.props;

    this.state = {
      isListOpen: false,
      title,
      selectedItem: null,
      keyword: "",
      list,
    };

    this.debounceDropDown = debounceFunction(
      (nextValue) => searchHandler(nextValue),
      500
    );
    this.searchField = React.createRef();
  }

  componentDidUpdate() {
    const { isListOpen } = this.state;

    setTimeout(() => {
      if (isListOpen) {
        window.addEventListener("click", this.close);
      } else {
        window.removeEventListener("click", this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.close);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { list } = nextProps;

    if (JSON.stringify(list) !== JSON.stringify(prevState.list)) {
      return { list };
    }

    return null;
  }

  close = () => {
    this.setState({
      isListOpen: false,
    });
  };

  clearSelection = () => {
    const { name, title, onChange } = this.props;

    this.setState(
      {
        selectedItem: null,
        title,
      },
      () => {
        onChange(null, name);
      }
    );
  };

  selectSingleItem = (item) => {
    const { list } = this.props;

    const selectedItem = list.find((i) => i.id === item.id);
    this.selectItem(selectedItem);
  };

  selectItem = (item) => {
    const { id, login } = item;
    const { selectedItem } = this.state;
    const { name, onChange } = this.props;

    this.setState(
      {
        title: login,
        isListOpen: false,
        selectedItem: item,
      },
      () => selectedItem?.id !== id && onChange(item, name)
    );
  };

  toggleList = () => {
    this.setState(
      (prevState) => ({
        isListOpen: !prevState.isListOpen,
        keyword: "",
      }),
      () => {
        if (this.state.isListOpen && this.searchField.current) {
          this.searchField.current.focus();
          this.setState({
            keyword: "",
          });
        }
      }
    );
  };

  filterList = (e) => {
    this.setState(
      {
        keyword: e.target.value.toLowerCase(),
      },
      () => {
        if (e.target.value) {
          this.debounceDropDown(e.target.value.toLowerCase());
        }
      }
    );
  };

  listItems = () => {
    const { id, searchable, checkIcon } = this.props;
    const { keyword, list } = this.state;
    let tempList = [...list];
    const selectedItemValue = this.state.selectedItem?.id;

    if (keyword.length) {
      tempList = list;
    }

    if (tempList.length) {
      return tempList.map((item) => (
        <button
          type="button"
          className={`dd-list-item ${id}`}
          key={item.value}
          onClick={() => this.selectItem(item)}
        >
          <img className="img-avatar" src={item.avatar_url} alt="img-avatar" />
          <span className="label">{item.login}</span>{" "}
          {item.id === selectedItemValue && (
            <span className="check">{checkIcon || <Check />}</span>
          )}
        </button>
      ));
    }

    return (
      <div className={`dd-list-item no-result ${id}`}>{searchable[1]}</div>
    );
  };

  render() {
    const { id, searchable } = this.props;
    const { isListOpen, title } = this.state;

    return (
      <div className={`dd-wrapper ${id}`}>
        <button
          type="button"
          className={`dd-header ${id}`}
          onClick={this.toggleList}
        >
          <div className={`dd-header-title ${id}`}>{title}</div>
          {isListOpen ? (
            <span>
              <ArrowUp />
            </span>
          ) : (
            <span>
              <ArrowDown />
            </span>
          )}
        </button>
        {isListOpen && (
          <div className={`dd-list${searchable ? " searchable" : ""} ${id}`}>
            {searchable && (
              <input
                ref={this.searchField}
                className={`dd-list-search-bar ${id}`}
                placeholder={searchable[0]}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => this.filterList(e)}
              />
            )}
            <div className={`dd-scroll-list ${id}`}>{this.listItems()}</div>
          </div>
        )}
      </div>
    );
  }
}

Dropdown.defaultProps = {
  id: "",
  searchable: undefined,
};

export default Dropdown;
