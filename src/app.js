import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, deleteField, deleteDoc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { auth } from "./firebase-sdk"; // Importer l'authentification depuis firebase-sdk.js// import { startFirebaseUI } from "./firebase-sdk.js";
import './main.scss';
import './fonts.scss';
import './custom-classes.scss';

import iconEdit from './img/icon-edit.svg';
import iconTrash from './img/icon-trash.svg';
import iconPoll from './img/icon-poll.svg';
import iconCross from './img/icon-cross-black.svg';

// document.addEventListener("DOMContentLoaded", () => {
//   const questionTxt = document.getElementById("questionTxt");
//   if (questionTxt) {
//     questionTxt.classList.add("fade-in");
//   }
// });

const db = getFirestore();
const dbRef = collection(db, "questions");

let elems = [];
var nbAlreadyAnswers = 0;
const error = {};

const header = document.querySelector('header');
if (header) {
  header.style.display = 'none';
}
const loginBox = document.getElementById('login-box');
if (loginBox) {
  loginBox.style.display = 'block';
}

//const userInfo = document.getElementById("user-info");
const body = document.querySelector("body");
const menuAdd = document.getElementById("menu-add");
const menuAddList = document.getElementById("menu-add-list");
const detailsTitle = document.getElementById("details-title");
const detailsBody = document.getElementById("details-body");
const btnNewPoll = document.getElementById("btn-new-poll");
const addFieldBtn = document.getElementById("add-field-btn");
const addBtn = document.querySelector(".add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const details = document.getElementById("details");
const closeBtn = document.getElementById("close-btn");
const saveBtn = document.getElementById("save-btn");


  


// ------------------------------------------------------------
// GET DATA
// ------------------------------------------------------------
export const getElems = async () => {
  try {
    await onSnapshot(dbRef, (docsSnap) => {
      elems = [];

      docsSnap.forEach((doc) => {
        const elem = doc.data();
        elem.id = doc.id;
        elems.push(elem);
      });
      //console.log(elems);
      showElems(elems);
    });
  } catch (err) {
    console.log("getElems: " + err);
  }
};

// ------------------------------------------------------------
// SHOW ELEMS
// ------------------------------------------------------------
const elemList = document.getElementById("elem-list");
const showElems = (elems) => {
  elemList.innerHTML = "";

  // Sort elems by timeCreated in descending order
  elems.sort((a, b) => parseInt(b.timeCreated) - parseInt(a.timeCreated));

  elems.forEach((elem) => {
    const formatDate = (dateStr) => {
      const year = dateStr.slice(0, 2);
      const month = dateStr.slice(2, 4);
      const day = dateStr.slice(4, 6);
      return `${day}/${month}/${year}`;
    };

    const formattedDate = formatDate(elem.timeCreated);
 
    const li = `
    <li class="elem-list-item bg-white h-60 p-5 rounded-md shadow-lg relative" id="${elem.id}">
        <div class="card-header flex items-center mb-4">
            <img src="${iconPoll}" alt="card-type" class="card-figure mr-4"/>
            <span class="card-title font-blickb">${elem.questionTxt}</span>
        </div>
        <div class="card-body mb-4">
            <span class="card-desc text-sm block mb-4 text-gray-400">Carte retraçant le parcours d’amit jusqu’en Inde sans utiliser l’avion</span>
            <span class="card-time text-xs block text-gray-400">Créé le ${formattedDate}</span>
        </div>
        <div class="card-footer flex items-center absolute bottom-5 left-5 right-5">
          <span class="text-gray-400 block mr-2">ID:</span>
          <button id="copy-id" class="text-sm text-gray-500 btn-secondary h-8 px-3 rounded-full">${elem.id}</button>
        
          <div class="flex ml-auto">
            <button id="edit-user" class="btn-secondary mr-3 w-8 h-8 rounded-full relative">
              <img src="${iconEdit}" alt="edit" class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-50"/>
            </button>
            <button id="delete-user" class="btn-secondary w-8 h-8 rounded-full relative">
              <img src="${iconTrash}" alt="delete" class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-50"/>
            </button>
          </div>
    </li>`;

    elemList.innerHTML += li;
  });
};


// ------------------------------------------------------------
// CLICK CONTACT LIST ITEM
// ------------------------------------------------------------
const elemListPressed = (event) => {
  const button = event.target.closest("button"); // Trouve le bouton parent
  if (!button) return; // Sécurité si on clique en dehors d'un bouton

  const id = event.target.closest("li")?.getAttribute("id"); // Vérifie si un <li> parent existe
  if (!id) return; // Sécurité si l'élément n'est pas dans un <li>

  if (button.id === "edit-user") {
      editButtonPressed(id);
  } else if (button.id === "delete-user") {
      deleteButtonPressed(id);
  } else if (button.id === "copy-id") {
      copyIdButtonPressed(id);
  } else {
      displayElemOnDetailsView(id);
      //toggleLeftAndRightViewsOnMobile();
  }
};

// const elemListPressed = (event) => {
//   const id = event.target.closest("li").getAttribute("id");
  
//   if (event.target.id === "edit-user") {
//     editButtonPressed(id);
//   } else if (event.target.id === "delete-user") {
//     deleteButtonPressed(id);
//   } else if (event.target.id === "copy-id") {
//     copyIdButtonPressed(id);
//   } else {
//     displayElemOnDetailsView(id);
//     //toggleLeftAndRightViewsOnMobile();
//   }
// };

// ------------------------------------------------------------
// CREATE DATA
// ------------------------------------------------------------
const btnNewPollPressed = () => {
  modalOverlay.style.display = "flex";
  details.style.display = "block";
  modalOverlay.removeAttribute("elem-id");
  menuAddList.classList.remove("is-visible");
  nbAlreadyAnswers = 2;

  detailsTitle.innerHTML = "Nouveau sondage";

  detailsBody.innerHTML = `
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Question</label>
      <input type="text" id="questionTxt" class="w-full h-12 rounded-md border px-4 mb-6" value="VIENT DETRE GENERED">
    </div>
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Proposition 0</label>
      <input type="text" id="answer0" class="w-full h-12 rounded-md border px-4 mb-6">
    </div>
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Proposition 1</label>
      <input type="text" id="answer1" class="w-full h-12 rounded-md border px-4 mb-6">
    </div>
  `;

  questionTxt = document.getElementById("questionTxt"),
  questionTxt.value = "";
  // answer0.value = "";
  // answer1.value = "";
  //answer2.value = "";
};

const addButtonPressed = () => {
  //event.stopPropagation();
  console.log("Clicked on:", event.target);
  menuAddList.classList.toggle("is-visible");
};



// ------------------------------------------------------------
// EDIT DATA
// ------------------------------------------------------------
const editButtonPressed = (id) => {
  modalOverlay.style.display = "flex";
  details.style.display = "block";
  const elem = getElem(id);
  //alert(contact.id);
  nbAlreadyAnswers = 0;

  detailsTitle.innerHTML = "Édition d'un sondage";

  detailsBody.innerHTML = `
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Question</label>
      <input type="text" id="questionTxt" class="w-full h-12 rounded-md border px-4 mb-6" value="${elem.questionTxt}">
    </div>
  `;

  elem.answers.forEach((answer, index) => {
    detailsBody.insertAdjacentHTML('beforeend', `
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Proposition ${index}<span class="block  delete-field cursor-pointer bg-gray-200 float-right translate-y-1 p-2"><img src="${iconCross}" alt="supprimer le champ" class="w-2"></span></label>
      <input type="text" id="answer${index}" class="w-full h-12 rounded-md border px-4 mb-6" value="${answer}">
    </div>
    `);
    nbAlreadyAnswers++;
  });
  

  

  questionTxt = document.getElementById("questionTxt"),
  
  questionTxt.value = elem.questionTxt;
  // answer0.value = elem.answers[0];
  // answer1.value = elem.answers[1];
  //answer2.value = elem.answers[2];


  modalOverlay.setAttribute("elem-id", elem.id);
};

// ------------------------------------------------------------
// ADD FIELD
// ------------------------------------------------------------
const addFieldBtnPressed = (event) => {

  detailsBody.insertAdjacentHTML('beforeend', `
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Proposition ${nbAlreadyAnswers}</label>
      <input type="text" id="answer${nbAlreadyAnswers}" class="w-full h-12 rounded-md border px-4 mb-6">
    </div>
    `);
  nbAlreadyAnswers++;

};

// ------------------------------------------------------------
// SAVE DATA
// ------------------------------------------------------------
const saveButtonPressed = async () => {
  //checkRequired([questionTxt, answer0, answer1, answer2]);
  // const fields = document.querySelectorAll("#details-body .input-group");
  // fields.forEach((field) => {
  //   alert(field.querySelector("input").value);
  // });

  //checkRequired(Array.from(fields));
  showErrorMessages(error);

  if (Object.keys(error).length === 0) {
    if (modalOverlay.getAttribute("elem-id")) {
      // update data
      const docRef = doc(
        db,
        "questions",
        modalOverlay.getAttribute("elem-id")
      );

      try {
          
          const x = [];  
          const fields = document.querySelectorAll("#details-body .input-group");

          fields.forEach((field, index) => {
            if (index !== 0) {
                const inputValue = field.querySelector("input").value;
                if (inputValue) {
                x.push(inputValue);
                }
            }
          });

          await updateDoc(docRef, {
            questionTxt: questionTxt.value,
            answers: x,
            timeUpdated: new Date().toISOString().slice(2, 10).replace(/-/g, '')
            //dateModified: new Date().toLocaleDateString('fr-FR')
          }, { merge: true });

        hideModal();
      } catch (e) {
        setErrorMessage(
          "error",
          "Unable to update user data to the database. Please try again later"
        );
        showErrorMessages();
      }
    } else {
      // add data
      try {
        // alert(answer0.value);
        const fields = document.querySelectorAll("#details-body .input-group");

        const x = [];
        const y = [];
        //alert(questionTxt.value);
        fields.forEach((field, index) => {
          if (index !== 0) {
              const inputValue = field.querySelector("input").value;
              if (inputValue) {
              x.push(inputValue);
              y.push(0);
              }
          }
        });

        //const test = [answer0.value, answer1.value, answer2.value];
        await addDoc(dbRef, {
          questionTxt: questionTxt.value,
          answers: x,
          counters: y,
          timeCreated: new Date().toISOString().slice(2, 10).replace(/-/g, ''),
          author: auth.currentUser.email, 
          type: 'poll'
          
        });

        hideModal();
      } catch (err) {
        setErrorMessage(
          "error",
          "Unable to add user data to the database. Please try again later"
        );
        showErrorMessages();
      }
    }
  }
};


// ------------------------------------------------------------
// CLOSE DETAILS
// ------------------------------------------------------------
const closeButtonPressed = () => {
  modalOverlay.style.display = "none";
  details.style.display = "none";
};


const deleteButtonPressed = async (id) => {
  const isConfirmed = confirm("Cet élément sera définitivement perdu. Voulez-vous continuer?");
  if (isConfirmed) {
    //alert(id);
    try {
      const docRef = doc(db, "questions", id);
      await deleteDoc(docRef);
    } catch (e) {
      setErrorMessage(
        "error",
        "Unable to delete the contact data. Please try again later"
      );
      showErrorMessages();
    }
  }
};

// ------------------------------------------------------------
// COPY ID TO CLIPBOARD
// ------------------------------------------------------------
const copyIdButtonPressed = (id) => {
  // Create a temporary textarea element
  const tempInput = document.createElement("textarea");
  tempInput.value = id; // Set the value to the ID
  document.body.appendChild(tempInput); // Append to the body
  tempInput.select(); // Select the text
  try {
      document.execCommand("copy"); // Copy the text
      alert("ID copied to clipboard: " + id);
  } catch (error) {
      console.error("Failed to copy ID: ", error);
  }
  document.body.removeChild(tempInput); // Clean up by removing the element
};








  

  

  

  
  
  

  

  

  

  // ------------------------------------------------------------
  // DISPLAY DETAILS VIEW ON LIST ITEM CLICK
  // -----------------------------------------------------------
  // const rightCol = document.getElementById("right-col");
  
  
  
  // const displayElemOnDetailsView = (id) => {
  //   const elem = getElem(id);
  //   //alert(rightCol);
  //   //alert(elem.id);
  //   // Display Right Col Title
  //   const rightColTitle = rightCol.querySelector(".title");
  //   // rightColTitle.innerHTML = contact.firstname;
  //   rightColTitle.innerHTML = "détails";
  
  //   const rightColDetail = document.getElementById("right-col-detail");
  //   rightColDetail.innerHTML = `
  
  //             <div class="label">Question posée</div>
  //             <div class="data">${elem.questionTxt}</div>
  
  //             <div class="label">Age:</div>
  //             <div class="data">${elem.age}</div>
  
  //             <div class="label">Phone:</div>
  //             <div class="data">${elem.phone}</div>
  
  //             <div class="label">Email:</div>
  //             <div class="data">${elem.email}</div>
  
  //     `;
  // };

  



  

  
  

  

 
    
    


// ------------------------------------------------------------
// ERROR MANAGEMENT
// ------------------------------------------------------------
const checkRequired = (inputArray) => {
  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      setErrorMessage(input, input.id + " is empty");
    } else {
      deleteErrorMessage(input);
    }
  });
};

const checkEmail = (input) => {
  if (input.value.trim() !== "") {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
      deleteErrorMessage(input);
    } else {
      setErrorMessage(input, input.id + " is invalid");
    }
  }
};

const checkInputLength = (input, num) => {
  if (input.value.trim() !== "") {
    if (input.value.trim().length === num) {
      deleteErrorMessage(input);
    } else {
      setErrorMessage(input, input.id + ` must be ${num} digits`);
    }
  }
};

const deleteErrorMessage = (input) => {
  delete error[input.id];
  input.style.border = "1px solid green";
};

const setErrorMessage = (input, message) => {
  if (input.nodeName === "INPUT") {
    error[input.id] = message;
    input.style.border = "1px solid red";
  } else {
    error[input] = message;
  }
};

const showErrorMessages = () => {
  let errorLabel = document.getElementById("error-label");
  errorLabel.innerHTML = "";
  for (const key in error) {
    const li = document.createElement("li");
    li.innerText = error[key];
    li.style.color = "red";
    errorLabel.appendChild(li);
  }
};
  

// ------------------------------------------------------------
// VARIOUS
// ------------------------------------------------------------
const showDetails = (event) => {
  // details.classList.remove("is-hidden");
  details.style.display = "block";
};
const hideDetails = (event) => {
  details.classList.add("is-hidden");
  details.style.display = "none";
};

const hideModal = (e) => {
  if (e instanceof Event) {
    if (e.target === e.currentTarget) {
      modalOverlay.style.display = "none";
      details.style.display = "none";
    }
  } else {
    modalOverlay.style.display = "none";
    details.style.display = "none";
  }
};

const getElem = (id) => {
  return elems.find((elem) => {
    return elem.id === id;
  });
};

const showBody = () => {
  setTimeout(() => {
    if (body) {
      body.classList.remove("is-hidden");
    }
  }, 500);
}
showBody();

// ------------------------------------------------------------
// AUTH EXPORTED FUNCTIONS
// ------------------------------------------------------------


export const clearElems = () => {
  elemList.innerHTML = "";
}

export const showLoginBox = () => {
  if (loginBox) {
    loginBox.style.display = 'block';
  }
}

export const hideLoginBox = () => {
  if (loginBox) {
    loginBox.style.display = 'none';
  }
}

export const showHeader = () => {
  if (header) {
    header.style.display = 'block';
  }
}

export const hideHeader = () => {
  if (header) {
    header.style.display = 'none';
  }
}

export const showAddBtn = () => {
  if (addBtn) {
    addBtn.style.display = 'block';
  }
}

export const hideAddBtn = () => {
  if (addBtn) {
    addBtn.style.display = 'none';
  }
}

// ------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------
elemList.addEventListener("click", elemListPressed);
addFieldBtn.addEventListener("click", addFieldBtnPressed);
addBtn.addEventListener("click", addButtonPressed);
btnNewPoll.addEventListener("click", btnNewPollPressed);
closeBtn.addEventListener("click", closeButtonPressed);
modalOverlay.addEventListener("click", hideModal);
saveBtn.addEventListener("click", saveButtonPressed);
menuAddList.addEventListener("mouseleave", () => {
  menuAddList.classList.remove("is-visible");
});

// header.addEventListener("mouseenter", () => {
//   console.log("HELLO");
// });