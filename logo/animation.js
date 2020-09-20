const svgPath = document.querySelectorAll('.Path');

const svgText = anime({
  targets: svgPath,
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 3000,
//   delay: (el, i) => { return i },
  direction: 'alternate',
  loop: true
});