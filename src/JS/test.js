const scrollElement = document.querySelector("#scroll");

scrollElement.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

  const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

  if (
    (scrollElement.scrollLeft <= 0 && e.deltaY < 0) ||
    (scrollElement.scrollLeft >= maxScrollLeft && e.deltaY > 0)
  )
    return;

  e.preventDefault();
  scrollElement.scrollLeft += e.deltaY;
});