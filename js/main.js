// language switcher

const langSwticher = document.getElementById("langSwitcher");
const langSwitcherContent = document.getElementById("langSwitcherContent");
const langSwitcherWrapper = document.getElementById("langSwitcherWrapper");

langSwticher.addEventListener("mouseenter", () => {
  langSwticher.classList.add("active");
  langSwitcherContent.classList.add("active");
});

langSwticher.addEventListener("mouseleave", (e) => {
  if (
    e.explicitOriginalTarget.classList[0] !==
      "header__lang-switcher__preview" &&
    e.explicitOriginalTarget !== langSwitcherWrapper
  ) {
    langSwticher.classList.remove("active");
    langSwitcherContent.classList.remove("active");
  }
});

langSwitcherContent.addEventListener("mouseleave", (e) => {
  langSwticher.classList.remove("active");
  langSwitcherContent.classList.remove("active");
});

// language switcher

// stars

async function getRating() {
  const res = await fetch(
    "https://monkfish-app-rsu9p.ondigitalocean.app/rating"
  ).then((res) => res.json());

  document.getElementById("rateCount").innerHTML = res.count;

  if (res.avgRating === null) document.getElementById("avgRate").innerHTML = 5;
  else {
    if (res.avgRating % 1 !== 0) {
      document.getElementById("avgRate").innerHTML = parseFloat(
        res.avgRating
      ).toFixed(1);
    } else {
      document.getElementById("avgRate").innerHTML = Math.floor(res.avgRating);
    }
  }
}
getRating();

const stars = document.querySelectorAll(".rate__star__el");
const rateDescriptions = document.querySelectorAll(".rate__star__el__text");
let isStarsFreezed = false;

stars.forEach((star, index) => {
  star.addEventListener("mouseenter", () => {
    rateDescriptions[index].classList.add("active");

    if (!rateStatus) {
      if (!isStarsFreezed) {
        stars[index].classList.add("active");

        if (index > 0) {
          for (let i = 0; i < index; i++) stars[i].classList.add("active");
        }
      }
    }
  });

  star.addEventListener("click", () => {
    isStarsFreezed = true;

    rateDescriptions.forEach((rateDescription) =>
      rateDescription.classList.remove("active")
    );

    let rate = 0;

    stars.forEach((s) => {
      if (s.classList.contains("active")) rate++;
    });

    if (!rateStatus) {
      postRate(rate);
    }
  });

  star.addEventListener("mouseleave", () => {
    rateDescriptions[index].classList.remove("active");

    if (!rateStatus) {
      if (!isStarsFreezed) {
        stars.forEach((tempStar) => tempStar.classList.remove("active"));
      }
    }
  });
});

async function postRate(rate) {
  const IP = await fetch("https://ipapi.co/json")
    .then((res) => res.json())
    .then((data) => data.ip);

  const bodyObj = {
    ip: IP,
    rate,
  };

  const obj = {
    method: "POST",
    body: JSON.stringify(bodyObj),
  };

  await fetch("https://monkfish-app-rsu9p.ondigitalocean.app/uploadrate", obj);

  getRating();
}

let rateStatus;
let serverRate;
async function isRatePosted() {
  const IP = await fetch("https://ipapi.co/json")
    .then((res) => res.json())
    .then((data) => data.ip);

  return await fetch(
    "https://monkfish-app-rsu9p.ondigitalocean.app/isPostRate/" + IP
  )
    .then((res) => res.json())
    .then((data) => {
      rateStatus = data.status;

      if (rateStatus) {
        serverRate = data.rate.rate;

        stars.forEach((star) => {
          star.classList.remove("active");
          // star.style.pointerEvents = "none";
        });
        for (let i = 0; i < serverRate; i++) {
          stars[i].classList.add("active");
        }
      }
    });
}
isRatePosted();

// stars

// dropzone

let dropzone = new Dropzone("div#dropzone", {
  url: "https://monkfish-app-rsu9p.ondigitalocean.app/upload",
  autoProcessQueue: false,
  clickable: false,
  previewsContainer: "#dropzonePreviewEl",
});
const inputFile = document.getElementById("inputFile");

Dropzone.prototype.filesize = function (size) {
  var selectedSize = Math.round(size / 1024);
  return "<strong>" + selectedSize + "</strong> KB";
};

dropzone.options = {
  previewTemplate: ` 
    <div class="dropzone__preview__el__wrapper">
  <div class="dropzone__preview__el template">
      <div class="dropzone__preview__el__left">
        <div class="dropzone__preview__el__img">
          <img src="img/heic.png" alt="" />
        </div>

        <div
          class="dropzone__preview__el__text dz-filename"
          data-dz-name=""
        ></div>
        <div class="dropzone__preview__el__size">
          <span data-dz-size=""></span>
        </div>
      </div>

      <a class="dropzone__preview__el__download">Convert to JPG</a>
      <div class="dropzone__preview__el__close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 50 50"
        >
          <path
            d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
          ></path>
        </svg>
      </div>
      </div>
      <div class="dropzone__preview__add-button">Add more files</div>
    </div>
    `,
  previewsContainer: "#dropzonePreviewEl",
  accept(file, done) {
    return done();
  },
  dictFileSizeUnits: {
    kb: "kb",
    b: "b",
    gb: "GB",
    mb: "MB",
    tb: "TB",
  },

  addedfile: function (file) {},
};

dropzone.on("addedfile", (file) => {
  const downloadButtons = document.querySelectorAll(
    ".dropzone__preview__el__download"
  );
  const addNewFileButtons = document.querySelectorAll(
    ".dropzone__preview__add-button"
  );

  for (let i = 0; i < addNewFileButtons.length; i++) {
    if (i != addNewFileButtons.length - 1)
      addNewFileButtons[i].classList.remove("active");
    else {
      addNewFileButtons[i].classList.add("active");

      addNewFileButtons[i].addEventListener("click", () => {
        openModal(0);

        document.getElementById("modalComputerBtn").onclick = () =>
          inputFile.click();
        document.getElementById("modalDropboxBtn").onclick = () =>
          dropboxButton.click();
      });
    }
  }

  document.getElementById("dropzoneSection").classList.add("active");

  document.getElementById("dropzoneContentTextWrapper").style.display = "none";
  convertButtons.style.display = "flex";
  document.getElementById("dropzone").classList.add("active");

  setDownloadButtonsListeners(downloadButtons);
  setCloseButtonsListeners();
});

var dt = new DataTransfer();
dropzone.on("drop", (e) => {
  const files = e.dataTransfer.files;

  for (let i = 0; i < files.length; i++) {
    dt.items.add(files[i]);
  }

  inputFile.files = dt.files;
});

inputFile.addEventListener("change", (e) => {
  const file = e.target.files[0];

  dropzone.emit("addedfile", file);
  dropzone.emit("complete", file);

  dropzone.files.push(file);

  document.getElementById("dropzone").classList.add("active");

  modals.forEach((modal, index) => closeModal(index, modal.innerHTML));
});

function setCloseButtonsListeners() {
  const closeButtons = document.querySelectorAll(
    ".dropzone__preview__el__close"
  );

  for (let i = 0; i < closeButtons.length; i++) {
    if (!closeButtons[i].classList.contains("dropboxClose")) {
      closeButtons[i].addEventListener("click", async () => {
        removeFile(dt.files[i]);

        if (dropzone.files.length === 0)
          document.getElementById("convertCancel").click();

        const addNewFileButtons = document.querySelectorAll(
          ".dropzone__preview__add-button"
        );

        for (let i = 0; i < addNewFileButtons.length; i++) {
          if (i != addNewFileButtons.length - 1)
            addNewFileButtons[i].classList.remove("active");
          else {
            addNewFileButtons[i].classList.add("active");

            addNewFileButtons[i].addEventListener("click", () => {
              openModal(0);

              document.getElementById("modalComputerBtn").onclick = () =>
                inputFile.click();
              document.getElementById("modalDropboxBtn").onclick = () =>
                dropboxButton.click();
            });
          }
        }
      });
    }
  }
}

let downloadButtons = [];
function setDownloadButtonsListeners(buttons) {
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      let isInDownloadButtons = false;

      for (let i = 0; i < downloadButtons.length; i++) {
        if (downloadButtons[i] === button) isInDownloadButtons = true;
      }

      if (!isInDownloadButtons) {
        button.innerHTML = "Loading...";
        if (convertFile(dropzone.files[index], button)) {
          downloadButtons.push(button);
        }
      }
    });
  });
}

var fileToDownloadHasBeen = [];
async function convertFile(file, DOMButton) {
  let isFileHasBeen = false;

  for (let i = 0; i < fileToDownloadHasBeen.length; i++) {
    if (file === fileToDownloadHasBeen[i]) isFileHasBeen = true;
  }

  if (!isFileHasBeen) {
    const formData = new FormData();
    formData.append("file", file);

    const obj = {
      method: "POST",
      body: formData,
    };
    let res = await fetch(
      "https://monkfish-app-rsu9p.ondigitalocean.app/upload",
      obj
    );

    if (res.status === 404) {
      alert("error");
      DOMButton.innerHTML = "error";

      return false;
    } else {
      res = await res.json();

      const serverName = await res.fileName;

      fileToDownloadHasBeen.push(file);

      if (await serverName) {
        setTimeout(async () => {
          await fetch(
            "https://monkfish-app-rsu9p.ondigitalocean.app/get/" + serverName
          )
            .then((res) => {
              if (res.status === 404) {
                alert("error");
                DOMButton.innerHTML = "error";
                return false;
              }
              return res.blob();
            })
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              DOMButton.href = url;
              DOMButton.download = `${file.name.split(".")[0]}.jpg`;
              DOMButton.innerHTML = "download";

              return true;
            });
        }, 2000);
      }
    }

    return false;
  }
}

var fileToCloseHasBeen = [];
function removeFile(file) {
  let isFileHasBeen = false;

  for (let i = 0; i < fileToCloseHasBeen.length; i++) {
    if (file === fileToCloseHasBeen[i]) isFileHasBeen = true;
  }

  if (!isFileHasBeen) {
    dropzone.removeFile(file);
    fileToCloseHasBeen.push(fileToCloseHasBeen);
  }
}

const convertButtons = document.getElementById("convertButtons");

document.getElementById("convertCancel").onclick = () => {
  dropzone.removeAllFiles();

  dt = new DataTransfer();

  fileToCloseHasBeen = [];
  fileToDownloadHasBeen = [];

  document.getElementById("dropzonePreviewEl").innerHTML = "";

  document.getElementById("dropzoneContentTextWrapper").style.display = "flex ";
  convertButtons.style.display = "none";

  document.getElementById("dropzone").classList.remove("active");
  document.getElementById("dropzoneSection").classList.remove("active");
};

const convertAll = document.getElementById("convertAll");
convertAll.onclick = () => {
  const downloadButtons = document.querySelectorAll(
    ".dropzone__preview__el__download"
  );

  dropzone.files.forEach((file, index) => {
    if (
      downloadButtons[index].innerHTML.toLowerCase() !== "download" &&
      downloadButtons[index].innerHTML.toLowerCase() !== "error"
    )
      downloadButtons[index].click();
  });
};

// dropzone

// modal

var modals = document.querySelectorAll(".modal");
var modalClose = document.querySelectorAll(".modal__close-button");

function openModal(index) {
  const initObj = modals[index].innerHTML;

  document.body.style.overflow = "hidden";
  modals[index].classList.add("active");

  modals[index].children[0].onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  modals[index].onclick = () => closeModal(index, initObj);
  modalClose[index].onclick = () => closeModal(index, initObj);

  return initObj;
}
function closeModal(index, initModal) {
  document.body.style.overflow = "auto";
  modals[index].innerHTML = initModal;

  modals[index].classList.remove("active");

  modals = document.querySelectorAll(".modal");
  modalClose = document.querySelectorAll(".modal__close-button");
}

// modal

// dropbox

options = {
  extensions: [".heic"],
  success: async function (file) {
    document.getElementById("dropzoneSection").classList.add("active");

    document.getElementById("dropzoneContentTextWrapper").style.display =
      "none";
    convertButtons.style.display = "flex";
    document.getElementById("dropzone").classList.add("active");

    const id = Date.now();

    const fileData = {
      name: file[0].name,
      size: file[0].bytes,
    };
    const previewTemplate = ` 
    <div class="dropzone__preview__el__wrapper" id="wrapper_${id}">
  <div class="dropzone__preview__el template">
      <div class="dropzone__preview__el__left">
        <div class="dropzone__preview__el__img">
          <img src="img/heic.png" alt="" />
        </div>

        <div
          class="dropzone__preview__el__text dz-filename"
          
        >${fileData.name}</div>
        <div class="dropzone__preview__el__size">
          <span>${fileData.size} b</span>
        </div>
      </div>

      <a class="dropzone__preview__el__download dropbox" id="${id}">Loading</a>
      <div class="dropzone__preview__el__close dropboxClose" id="close_${id}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 50 50"
        >
          <path
            d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
          ></path>
        </svg>
      </div>
      </div>
      <div class="dropzone__preview__add-button">Add more files</div>
    </div>
    `;
    document.getElementById("dropzonePreviewEl").innerHTML += previewTemplate;
    setCloseButtonsListeners();
    addDropboxFileCloseButtonListener(id);

    const addNewFileButtons = document.querySelectorAll(
      ".dropzone__preview__add-button"
    );

    for (let i = 0; i < addNewFileButtons.length; i++) {
      if (i != addNewFileButtons.length - 1)
        addNewFileButtons[i].classList.remove("active");
      else {
        addNewFileButtons[i].classList.add("active");

        addNewFileButtons[i].addEventListener("click", () => {
          openModal(0);

          document.getElementById("modalComputerBtn").onclick = () =>
            inputFile.click();
          document.getElementById("modalDropboxBtn").onclick = () =>
            dropboxButton.click();
        });
      }
    }
    uploadDropboxLink(file[0], id);
  },
  cancel: function () {},
  linkType: "preview",
  multiselect: false,
  folderselect: false,
};

const dropboxButton = document.getElementById("dropboxDownload");

dropboxButton.onclick = () => {
  Dropbox.choose(options);

  modals.forEach((modal, index) => closeModal(index, modal.innerHTML));
};

async function uploadDropboxLink(file, id) {
  const btn = document.getElementById(id);

  const obj = {
    method: "POST",
    body: JSON.stringify(file),
  };

  let res = await fetch(
    "https://monkfish-app-rsu9p.ondigitalocean.app/linkupload",
    obj
  );

  if (res.status === 404) {
    alert("error");
    btn.innerHTML = "error";

    return false;
  } else {
    res = await res.json();

    const serverName = await res.fileName;

    fileToDownloadHasBeen.push(file);

    if (await serverName) {
      setTimeout(async () => {
        await fetch(
          "https://monkfish-app-rsu9p.ondigitalocean.app/get/" + serverName
        )
          .then((res) => {
            if (res.status === 404) {
              alert("error");
              btn.innerHTML = "error";
              return false;
            }
            return res.blob();
          })
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            btn.href = url;
            btn.download = `${file.name.split(".")[0]}.jpg`;
            btn.innerHTML = "download";

            return true;
          });
      }, 2000);
    }
  }
}

function addDropboxFileCloseButtonListener(id) {
  const DOMElement = document.getElementById("wrapper_" + id);
  const closeButton = document.getElementById("close_" + id);

  closeButton.addEventListener("click", () => {
    DOMElement.remove();

    const addNewFileButtons = document.querySelectorAll(
      ".dropzone__preview__add-button"
    );

    for (let i = 0; i < addNewFileButtons.length; i++) {
      if (i != addNewFileButtons.length - 1)
        addNewFileButtons[i].classList.remove("active");
      else {
        addNewFileButtons[i].classList.add("active");

        addNewFileButtons[i].addEventListener("click", () => {
          openModal(0);

          document.getElementById("modalComputerBtn").onclick = () =>
            inputFile.click();
          document.getElementById("modalDropboxBtn").onclick = () =>
            dropboxButton.click();
        });
      }
    }

    if (document.getElementById("dropzonePreviewEl").children.length === 0) {
      document.getElementById("convertCancel").click();
    }
  });
}

// dropbox
