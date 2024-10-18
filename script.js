config = {
  particles: {
    number: {
      value: 600,
      density: {
        enable: true,
        value_area: 1893.9543399174545,
      },
    },
    color: {
      value: "#282828",
    },
    shape: {
      type: "star",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 10,
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.25654592973848367,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 0,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 8.017060304327615,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "bounce",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

setTimeout(async () => {
  particlesJS("particles-js", config, function () {
    console.log("[callback] - particles.js config loaded");
  });
}, 10);

var i = 0;
var txt = " 1tz Arad";

var i2 = 0;
var txt2 = "but you can call me Arad...";

async function typeWriter() {
  if (i < txt.length) {
    document.getElementById("whoisme").innerHTML = document
      .getElementById("whoisme")
      .innerText.replace("_", "");
    document.getElementById("whoisme").innerHTML += txt.charAt(i);
    setTimeout(async () => {
      document.getElementById("whoisme").innerHTML += "_";
      i++;

      setTimeout(typeWriter, 100);
    }, 30);
  } else {
    document.getElementById("whoisme").innerHTML = document
      .getElementById("whoisme")
      .innerText.replace("_", "");
    typeWriter2();
  }
}

async function typeWriter2() {
  if (i2 < txt2.length) {
    document.getElementById("whoismed").innerHTML += txt2.charAt(i2);
    i2++;

    setTimeout(typeWriter2, 80);
  }
}

function toast() {
  var toastElList = [].slice.call(document.querySelectorAll(".toast"));
  var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach((toast) => toast.show());
}

setTimeout(async () => {
  document.getElementById("abjagh").className =
    "toast position-fixed end-0 bottom-0 mx-3 my-3";
}, 60000);
