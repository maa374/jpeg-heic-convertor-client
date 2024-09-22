// translating

const language = window.location.toString().split("/")[3].split("?")[1];

var localization = translates[language];

if (!localization) localization = translates["en"];

// translating

// language switcher

const langSwticher = document.getElementById("langSwitcher");
const langSwitcherContent = document.getElementById("langSwitcherContent");
const langSwitcherWrapper = document.getElementById("langSwitcherWrapper");

langSwticher.addEventListener("mouseenter", () => {
  langSwticher.classList.add("active");
  langSwitcherContent.classList.add("active");
});

langSwticher.addEventListener("mouseleave", (e) => {
  if (e.toElement !== undefined) {
    if (
      e.toElement !== langSwitcherWrapper &&
      e.toElement !== langSwitcherContent
    ) {
      langSwticher.classList.remove("active");
      langSwitcherContent.classList.remove("active");
    }
  }
  if (e.explicitOriginalTarget !== undefined) {
    if (
      e.explicitOriginalTarget !== langSwitcherWrapper &&
      e.explicitOriginalTarget !== langSwitcherContent
    ) {
      langSwticher.classList.remove("active");
      langSwitcherContent.classList.remove("active");
    }
  }
});

langSwitcherWrapper.addEventListener("mouseleave", () => {
  langSwticher.classList.remove("active");
  langSwitcherContent.classList.remove("active");
});

langSwitcherContent.addEventListener("mouseleave", (e) => {
  langSwticher.classList.remove("active");
  langSwitcherContent.classList.remove("active");
});

const footerLangSwticher = document.getElementById("footerLangSwitcher");
const footerLangSwitcherContent = document.getElementById(
  "footerLangSwitcherContent"
);
const footerLangSwitcherWrapper = document.getElementById(
  "footerLangSwitcherWrapper"
);

footerLangSwticher.addEventListener("click", () => {
  footerLangSwticher.classList.toggle("active");
  footerLangSwitcherContent.classList.toggle("active");
});

window.addEventListener("click", (e) => {
  if (e.target !== footerLangSwticher) {
    footerLangSwticher.classList.remove("active");
    footerLangSwitcherContent.classList.remove("active");
  }
});

window.addEventListener("touchstart", (e) => {
  if (e.target !== footerLangSwticher) {
    footerLangSwticher.classList.remove("active");
    footerLangSwitcherContent.classList.remove("active");
  }
});

// language switcher

// stars

async function getRating() {
  const res = await fetch(
    "https://monkfish-app-rsu9p.ondigitalocean.app/rating"
    // "http://localhost:8080/rating"
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

let rateStatus = true;
let serverRate;
async function isRatePosted() {
  const IP = await fetch("https://ipapi.co/json")
    .then((res) => res.json())
    .then((data) => data.ip);

  return await fetch(
    // "http://localhost:8080/isPostRate/" + IP
    "https://monkfish-app-rsu9p.ondigitalocean.app/isPostRate/" + IP
  )
    .then((res) => res.json())
    .then((data) => {
      getRating();
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

      <div class="dropzone__preview__el__right">
        <div class="dropzone__preview__converted-file-data">
          <div class="dropzone__preview__converted-file-data__format">.JPG</div>
          <div class="dropzone__preview__converted-file-data__size"><span class="dropzonePreviewSize"></span> kb</div>
        </div>
              
        <a class="dropzone__preview__el__download">${localization.convertToJPEG}</a>
      </div>
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
      <div class="dropzone__preview__add-button">${localization.addMoreFiles}</div>
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

  if (dropzone.files.length > 0) {
    convertAll.innerHTML = localization.convertAll;
  }

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
        document.getElementById("modalLinkBtn").onclick = () => {
          linkButton.click();
        };
      });
    }
  }

  document.getElementById("dropzoneSection").classList.add("active");

  document.getElementById("dropzoneContentTextWrapper").classList.add("active");

  setTimeout(() => {
    document.getElementById("convertButtons").classList.add("put");
  }, 10);

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

    // dropzone.emit("addedfile", files[i]);
    // dropzone.emit("complete", files[i]);

    dropzone.files.push(files[i]);
  }
  setCloseButtonsListeners();
});

inputFile.addEventListener("change", (e) => {
  const files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    dt.items.add(file);

    dropzone.emit("addedfile", file);
    dropzone.emit("complete", file);

    dropzone.files.push(file);
  }

  setCloseButtonsListeners();
  document.getElementById("dropzone").classList.add("active");

  modals.forEach((modal, index) => closeModal(index, modal.innerHTML));
});

function setCloseButtonsListeners() {
  const closeButtons = document.querySelectorAll(
    ".dropzone__preview__el__close"
  );

  let dropboxStatus = false;
  for (let i = 0; i < closeButtons.length; i++) {
    if (!closeButtons[i].classList.contains("dropboxClose")) {
      closeButtons[i].addEventListener("click", async (e) => {
        if (dropzone.files.length === 0)
          document.getElementById("convertCancel").click();

        const addNewFileButtons = document.querySelectorAll(
          ".dropzone__preview__add-button"
        );

        removeFile(dt.files[i]);

        if (dropboxStatus) {
          closeButtons[i].offsetParent.remove();
        }

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
              document.getElementById("modalLinkBtn").onclick = () =>
                linkButton.click();
            });
          }
        }
      });
    } else dropboxStatus = true;
  }
}

let downloadButtons = [];
function setDownloadButtonsListeners(buttons) {
  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      let isInDownloadButtons = false;

      for (let i = 0; i < downloadButtons.length; i++) {
        if (downloadButtons[i] === button) isInDownloadButtons = true;
      }

      if (!isInDownloadButtons) {
        button.innerHTML = localization.loading;
        button.classList.add("loading");
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
      // "http://localhost:8080/upload",
      "https://monkfish-app-rsu9p.ondigitalocean.app/upload",
      obj
    );

    if (res.status === 404) {
      DOMButton.innerHTML = localization.error;
      DOMButton.classList.remove("loading");

      return false;
    } else {
      res = await res.json();

      const serverName = await res.fileName;

      fileToDownloadHasBeen.push(file);

      if (await serverName) {
        setTimeout(async () => {
          await fetch(
            // "http://localhost:8080/get/" + serverName
            "https://monkfish-app-rsu9p.ondigitalocean.app/get/" + serverName
          )
            .then((res) => {
              if (res.status === 404) {
                DOMButton.innerHTML = localization.error;
                DOMButton.classList.remove("loading");
                DOMButton.parentNode.classList.add("none");

                return false;
              }
              return res.blob();
            })
            .then((blob) => {
              const parentNode = DOMButton.parentNode;

              parentNode.classList.add("active");
              parentNode.querySelectorAll(".dropzonePreviewSize")[0].innerHTML =
                (blob.size / 1024).toFixed(1);

              const url = window.URL.createObjectURL(blob);
              DOMButton.href = url;
              DOMButton.download = `${file.name.split(".")[0]}.jpg`;
              DOMButton.innerHTML = localization.download;
              DOMButton.classList.remove("loading");
              addDownloadButtonsListener();

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
  dropzone.files = [];

  fileToCloseHasBeen = [];
  fileToDownloadHasBeen = [];

  document.getElementById("dropzonePreviewEl").innerHTML = "";

  document.getElementById("convertButtons").classList.remove("put");

  setTimeout(() => {
    document
      .getElementById("dropzoneContentTextWrapper")
      .classList.remove("active");

    document.getElementById("convertButtons").style.display = "none";
  }, 190);

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
      downloadButtons[index].innerHTML.toLowerCase() !==
        localization.download &&
      downloadButtons[index].innerHTML.toLowerCase() !== localization.error
    )
      downloadButtons[index].click();
  });

  downloadButtons.forEach((btn) => {
    if (btn.innerHTML.toLowerCase() === localization.download) btn.click();
  });
};

// dropzone

// modal

var modals = document.querySelectorAll(".modal");
var modalClose = document.querySelectorAll(".modal__close-button");

function openModal(index) {
  const initObj = modals[index].innerHTML;

  setTimeout(() => {
    document.body.style.position = "fixed";
    document.body.classList.add("noscroll");
  }, 10);
  modals[index].classList.add("active");

  setTimeout(() => {
    modals[index].classList.add("visible");
  }, 10);

  modals[index].children[0].onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  modals[index].onclick = () => closeModal(index, initObj);
  modalClose[index].onclick = () => closeModal(index, initObj);

  isModalOpen = true;

  return initObj;
}

function closeModal(index, initModal) {
  if (initModal) modals[index].innerHTML = initModal;

  modals[index].classList.remove("visible");

  document.body.style.position = "static";
  document.body.style.width = window.innerWidth;

  setTimeout(() => {
    modals[index].classList.remove("active");
  }, 320);

  modals = document.querySelectorAll(".modal");
  modalClose = document.querySelectorAll(".modal__close-button");
}

// modal

// dropbox

options = {
  extensions: [".heic", ".heif"],
  success: async function (file) {
    document.getElementById("dropzoneSection").classList.add("active");

    document
      .getElementById("dropzoneContentTextWrapper")
      .classList.add("active");

    setTimeout(() => {
      document.getElementById("convertButtons").classList.add("put");
    }, 10);

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
          <span>${(fileData.size / 1024).toFixed(1)} kb</span>
        </div>
      </div>

      <div class="dropzone__preview__el__right">
        <div class="dropzone__preview__converted-file-data">
          <div class="dropzone__preview__converted-file-data__format">.JPG</div>
          <div class="dropzone__preview__converted-file-data__size"><span class="dropzonePreviewSize"></span> kb</div>
        </div>
              
        <a class="dropzone__preview__el__download dropbox" id="${id}">${
      localization.loading
    }</a>
      </div>
                
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
      <div class="dropzone__preview__add-button">${
        localization.addMoreFiles
      }</div>
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
          document.getElementById("modalLinkBtn").onclick = () =>
            linkButton.click();
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
    // "http://localhost:8080/linkupload",
    "https://monkfish-app-rsu9p.ondigitalocean.app/linkupload",
    obj
  );

  if (res.status === 404) {
    btn.innerHTML = localization.error;

    return false;
  } else {
    res = await res.json();

    const serverName = await res.fileName;

    fileToDownloadHasBeen.push(file);

    if (await serverName) {
      setTimeout(async () => {
        await fetch(
          "https://monkfish-app-rsu9p.ondigitalocean.app/get/" + serverName
          // "http://localhost:8080/get/" + serverName
        )
          .then((res) => {
            if (res.status === 404) {
              btn.innerHTML = localization.error;
              btn.classList.remove("loading");
              document.getElementById(id).parentNode.classList.add("none");

              return false;
            }
            return res.blob();
          })
          .then((blob) => {
            const parentNode = document.getElementById(id).parentNode;

            parentNode.classList.add("active");
            parentNode.querySelectorAll(".dropzonePreviewSize")[0].innerHTML = (
              blob.size / 1024
            ).toFixed(1);

            const url = window.URL.createObjectURL(blob);
            btn.href = url;
            btn.download = `${file.name.split(".")[0]}.jpg`;
            btn.innerHTML = localization.download;
            addDownloadButtonsListener();

            return true;
          });
      }, 2000);
    }
  }
}

function addDownloadButtonsListener() {
  const downloadButtons = document.querySelectorAll(
    ".dropzone__preview__el__download"
  );

  let status = true;
  downloadButtons.forEach((btn) => {
    if (btn.innerHTML.toLowerCase() !== localization.download) status = false;
  });

  if (status) convertAll.innerHTML = localization.download;
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
          document.getElementById("modalLinkBtn").onclick = () =>
            linkButton.click();
        });
      }
    }

    if (document.getElementById("dropzonePreviewEl").children.length === 0) {
      document.getElementById("convertCancel").click();
    }
  });
}

// dropbox

// link modal

const linkButton = document.getElementById("linkDownload");

linkButton.onclick = () => {
  closeModal(0);
  setTimeout(() => {
    const initElement = openModal(1);

    let inputs = document.querySelectorAll(".linkDownloadInput");

    document.getElementById("linkModalSubmit").onclick = async () => {
      inputs.forEach(async (input, index) => {
        const value = input.value;
        const id = Date.now() + index;

        const clientName = value.split("/")[value.split("/").length - 1];

        const res = await fetch(
          "https://monkfish-app-rsu9p.ondigitalocean.app/linkupload",
          {
            method: "POST",
            body: JSON.stringify({ link: value }),
          }
        ).then((data) => data.json());

        if (res) {
          document.getElementById("dropzoneSection").classList.add("active");

          document
            .getElementById("dropzoneContentTextWrapper")
            .classList.add("active");

          setTimeout(() => {
            document.getElementById("convertButtons").classList.add("put");
          }, 10);

          convertButtons.style.display = "flex";
          document.getElementById("dropzone").classList.add("active");

          const fileData = {
            serverName: res.fileName,
            clientName,
            size: res.size,
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
  
          >${fileData.clientName}</div>
            <div class="dropzone__preview__el__size">
              <span>${Math.round(fileData.size / 1024)} KB</span>
             </div>
          </div>
  
          <div class="dropzone__preview__el__right">
             <div class="dropzone__preview__converted-file-data">
                 <div class="dropzone__preview__converted-file-data__format">.JPG</div>
               <div class="dropzone__preview__converted-file-data__size"><span class="dropzonePreviewSize"></span> kb</div>
             </div>
             <a class="dropzone__preview__el__download loading dropbox" id="${id}">Loading</a>
           </div>
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
           <div class="dropzone__preview__add-button">${
             localization.addMoreFiles
           }</div>
         </div>
         `;

          document.getElementById("dropzonePreviewEl").innerHTML +=
            previewTemplate;
          setCloseButtonsListeners();
          addDropboxFileCloseButtonListener(id);
          setDownloadButtonsListeners(
            document.querySelectorAll(".dropzone__preview__el__download")
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
                document.getElementById("modalLinkBtn").onclick = () =>
                  linkButton.click();
              });
            }
          }

          setTimeout(async () => {
            const btn = document.getElementById(id);

            await fetch(
              "https://monkfish-app-rsu9p.ondigitalocean.app/get/" +
                fileData.serverName
            )
              .then((res) => {
                if (res.status === 404) {
                  btn.innerHTML = localization.error;
                  btn.classList.remove("loading");
                  document.getElementById(id).parentNode.classList.add("none");

                  return false;
                }

                return res.blob();
              })
              .then((blob) => {
                const parentNode = document.getElementById(id).parentNode;
                btn.classList.remove("loading");

                parentNode.classList.add("active");
                parentNode.querySelectorAll(
                  ".dropzonePreviewSize"
                )[0].innerHTML = (blob.size / 1024).toFixed(1);

                const url = window.URL.createObjectURL(blob);
                btn.href = url;
                btn.download = fileData.clientName;
                btn.innerHTML = localization.download;
                addDownloadButtonsListener();

                return true;
              });
          }, 2000);
        }
      });

      closeModal(1, initElement);
    };
    document.getElementById("linkModalCancel").onclick = () =>
      closeModal(1, initElement);

    document.getElementById("addMoreLinkModal").onclick = () => {
      const element = `<input type="text" placeholder="http://" class="linkDownloadInput">`;

      const inputsValues = getInputsValues();

      document.getElementById("linkModalInputWrapper").innerHTML += element;
      inputs = document.querySelectorAll(".linkDownloadInput");

      for (let i = 0; i < inputs.length; i++) {
        if (inputsValues[i]) inputs[i].value = inputsValues[i];
      }
    };

    function getInputsValues() {
      const values = [];

      inputs.forEach((input) => values.push(input.value));

      return values;
    }
  }, 310);
};

document.getElementById("modalLinkBtn").onclick = () => {
  console.log("modalLinkBtn");
};

// link modal
