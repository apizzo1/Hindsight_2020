const svgPath = document.querySelectorAll('.Path');

const svgText = anime({
  targets: svgPath,
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutQuad',
  duration: 5000,
//   delay: (el, i) => { return i },
  direction: 'alternate',
  loop: true
});