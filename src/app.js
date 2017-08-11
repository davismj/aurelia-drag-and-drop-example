export class App {
  
  // model data
  list = [
    { name: 'first', value: 1 },
    { name: 'second', value: 2 },
    { name: 'third', value: 3 },
    { name: 'fourth', value: 4 }
  ];

  // In es2016, we have object destructuring. Meaning this:
  //
  // dragstart({ detail: event }) 
  //
  // is equivalent to this es5 code:
  //
  // dragstart(_event) {
  //   var event = _event.detail;
  // }

  // When we begin dragging, we want to register all the information that we will need
  // while we drag. In this case, I call the function "getBreakpoints" which computes
  // the various mouse locations that will trigger the dragged element to switch places.
  // I also compute the offset between the list element and list item, which aides me 
  // when computing where the mouse cursor is with respect to the list. Finally, I turn
  // on a "is-dragging" class, which lets me easily and dynamically add styles.
  dragstart({ detail: event }, item) {
    let breakpoints = this.getBreakpoints(event.target.parentElement);
    let offset = event.target.offsetTop - event.target.parentElement.offsetTop;
    event.interaction.data = { item, breakpoints, offset }; // equivalent to { item: item }
    event.target.classList.add('is-dragging');
  }

  // When the drag is complete, whether it was successful or not, we want to clean up. We
  // don't really need to worry about object references, but we do want to make sure that
  // our element doesn't look like its being dragged anymore.
  dragend({ detail: event }) {
    event.target.classList.remove('is-dragging');
  }

  // During the drag, we want to compute the mouse position with respect to the list and
  // figure out which breakpoint that falls into. To be honest, I didn't think I would have
  // needed this offset value originally, but I found that my breakpoints were off by a 
  // little bit and investigating showed that it had to do with the original position of
  // the element with respect to the list.
  drag({ detail: event }) {
    let breakpoints = event.interaction.data.breakpoints;
    let position = (event.clientY - event.clientY0 + event.interaction.data.offset);
    let index = breakpoints.findIndex((breakpoint) => breakpoint > position);
    if (index > -1) {
      this.moveElementToIndex(event.target, index);
    }
  }

  // On drop, we want to "finalize" the data transacction. Though I'm sure it's possible, 
  // I did not bother to make the data transformations real time. Instead, we were just 
  // changing the position of list elements to demonstrate what the data will look like 
  // when dropped. Here, we look at the elements, figure out how the dragged element moved,
  // and make the transformation to the underlying data. This will tell Aurelia to rerender
  // the list, though it will end up looking the same.
  drop({ detail: event}) {
    const item = event.interaction.data.item;
    const element = event.dragEvent.target;

    // Most arrays in the DOM API are not actual arrays and therefore do not have access to
    // normal array methods. However, the Array.from static method is able to cast most 
    // array-like objects into actual arrays, giving us access to functions like forEach
    // and indexOf.
    const newIndex = Array.from(event.target.children).indexOf(element);
    const currentIndex = this.list.indexOf(item);
    if (currentIndex !== newIndex) {
      this.list.splice(currentIndex, 1);
      this.list.splice(newIndex, 0, item)
    }
  }

  // The "getBreakpoints" functions creates an array of the halfway mark of each child
  // element to the given parent. We use this to calculate whether a dragged item should 
  // be moved or not. It is only used once, on dragstart.
  getBreakpoints(parent) {
    const breakpoints = [];
    const children = Array.from(parent.children);
    children.forEach((child) => {
      breakpoints.push((child.offsetTop - parent.offsetTop) + child.offsetHeight / 2);
    });
    return breakpoints
  }

  // The "moveElementToIndex" function handles moving the DOM elements. Since the DOM API
  // is a bit messy at time, in this case requiring "append" or "insertBefore" depending on
  // whether we are inserting the final element or not, I've abstracted this out into its own
  // function.
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
  }

  // By using get json(), we force aurelia to use a dirty checking strategy on the value. 
  // Though there are better solutions, this is an effective way of observing deeply nested and 
  // hard to observe data such as complex objects. It creates negligible performance overhead 
  // and is safe to use whenever you know that the computation will not grow quickly.
  get json() {
    return JSON.stringify(this.list, null, 2);
  }
}
