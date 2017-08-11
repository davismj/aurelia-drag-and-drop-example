export class App {
  
  // models
  list = [
    { name: 'first', value: 1 },
    { name: 'second', value: 2 },
    { name: 'third', value: 3 },
    { name: 'fourth', value: 4 }
  ];

  // In es2016, we have object destructuring. Meaning this:

  // dragstart({ detail: event }) 

  // is equivalent to this es5 code:

  // dragstart(_event) {
  //   var event = _event.detail;
  // }

  dragstart({ detail: event }, item) {
    let breakpoints = this.getBreakpoints(event.target.parentElement);
    let offset = event.target.offsetTop - event.target.parentElement.offsetTop;
    event.interaction.data = { item, breakpoints, offset }; // equivalent to { item: item }
    event.target.classList.add('is-dragging');
  }

  dragend({ detail: event }) {
    event.target.style.webkitTransform = event.target.style.transform = 'translateY(0)';
    event.target.classList.remove('is-dragging');
  }

  drag({ detail: event }) {
    let breakpoints = event.interaction.data.breakpoints;
    let position = (event.clientY - event.clientY0 + event.interaction.data.offset);
    let index = breakpoints.findIndex((breakpoint) => breakpoint > position);
    if (index > -1) {
      this.moveElementToIndex(event.target, index);
    }
  }

  drop({ detail: event}) {
    const item = event.interaction.data.item;
    const element = event.dragEvent.target;
    const newIndex = Array.from(event.target.children).indexOf(element);
    const currentIndex = this.list.indexOf(item);
    debugger;
    if (currentIndex !== newIndex) {
      this.list.splice(currentIndex, 1);
      this.list.splice(newIndex, 0, item)
    }
  }

  getBreakpoints(parent) {
    const breakpoints = [];
    const children = Array.from(parent.children);
    children.forEach((child) => {
      // each breakpoint is at the halfway mark of the next element
      breakpoints.push((child.offsetTop - parent.offsetTop) + child.offsetHeight / 2);
    });
    return breakpoints
  }

  moveElementToIndex(element, index) {
    let parent = element.parentElement;
    let currentIndex = Array.from(parent.children).indexOf(element);
    let currentOffset = element.offsetTop;

    if (index === currentIndex) {
      return;
    }

    parent.removeChild(element);
    if (index > parent.children.length) {
      parent.append(element);
    } else {
      let sibling = parent.children[index];
      parent.insertBefore(element, sibling);
    }

    let y = element.getAttribute('data-y');
    element.setAttribute('data-y', y - (element.offsetTop - currentOffset));
  }

  get json() {
    return JSON.stringify(this.list, null, 2);
  }
}
