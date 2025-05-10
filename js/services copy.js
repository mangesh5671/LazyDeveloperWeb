document.querySelectorAll('.learn-more').forEach(link => {
    link.addEventListener('click', function(event) {
      alert('Redirecting to ' + this.href);
    });
  });

//<!--Header js-->
const topBar = document.getElementById('topBar');
const navBar = document.getElementById('navBar');

function onScroll() {
  if (window.scrollY > 10) {
    topBar.classList.add('scrolled');
    navBar.classList.add('scrolled');
  } else {
    topBar.classList.remove('scrolled');
    navBar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll);