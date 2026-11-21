/* Turns a normal <a href="#book"> into a smart link: works without
   JavaScript, and with JavaScript it also focuses the form. */
export function bookLinkProps(onBook, service) {
  return {
    href: '#book',
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      onBook(service);
    },
  };
}
