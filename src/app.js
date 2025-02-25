import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, deleteField, deleteDoc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { auth } from "./firebase-sdk"; // Importer l'authentification depuis firebase-sdk.js// import { startFirebaseUI } from "./firebase-sdk.js";
import './main.scss';
import './fonts.scss';
import './custom-classes.scss';

import iconEdit from './img/icon-edit.svg';
import iconTrash from './img/icon-trash.svg';
import iconPoll from './img/icon-poll.svg';
import iconCalendar from './img/icon-calendar.svg';
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
const filterByType = document.getElementById("filter-by-type");
const menuUser = document.getElementById("menu-user");
const menuUserList = document.getElementById("menu-user-list");
const menuAddList = document.getElementById("menu-add-list");
const menuItemActions = document.getElementById("menu-itemactions");
const menuItemActionsList = document.getElementById("menu-itemactions-list");
const detailsTitle = document.getElementById("details-title");
const detailsBody = document.getElementById("details-body");
const btnNewPoll = document.getElementById("btn-new-poll");
const btnNewCalendar = document.getElementById("btn-new-calendar");
const addFieldBtn = document.getElementById("add-field-btn");
const addBtn = document.querySelector(".add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const details = document.getElementById("details");
const closeBtn = document.getElementById("close-btn");
const saveBtn = document.getElementById("save-btn");

let type = "";


  


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
      console.log(elems);
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
    let totalVotes;
    let li = "";

    if (elem.type === 'poll') {
      totalVotes = Object.values(elem.counters).reduce((acc, val) => acc + val, 0);
      li = `
      <li class="${elem.type} elem-list-item bg-white h-60 p-5 rounded-md shadow-lg relative" id="${elem.id}">
          <div class="card-header flex items-center mb-4">
              <img src="${iconPoll}" alt="card-type" class="card-figure mr-4"/>
              <span class="card-title font-blickb">${elem.questionTxt}</span>
              <span class="font-blick font-normal antialiased ml-auto bg-amber-100">${totalVotes}</span>
          </div>
          <div class="card-body mb-4">
              <span class="card-desc text-sm block mb-4 text-gray-400">Description à venir</span>
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
      </li>
      `;
    }
    else if (elem.type === 'calendar') {
      totalVotes = null;
      li = `
      <li class="${elem.type} elem-list-item bg-white h-60 p-5 rounded-md shadow-lg relative" id="${elem.id}">
          <div class="card-header flex items-center mb-4">
              <img src="${iconCalendar}" alt="card-type" class="card-figure mr-4"/>
              <span class="card-title font-blickb">${elem.calName}</span>
              <!--<span class="font-blick font-normal antialiased ml-auto bg-amber-100">${totalVotes}</span>-->
          </div>
          <div class="card-body mb-4">
              <span class="card-desc text-sm block mb-4 text-gray-400">Description à venir</span>
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
    }

    // let totalVotes = 0;
    // for (let i = 0; i < elem.counters.length; i++) {
    //   //totalVotes += elem.counters[i];
      
    // }

    

    elemList.innerHTML += li;
  });
};


// ------------------------------------------------------------
// FILTER BY TYPE PRESSED
// ------------------------------------------------------------
const filterByTypePressed = (event) => {
  const liElements = filterByType.querySelectorAll('li');
  liElements.forEach(li => {
    li.classList.remove('font-blickb');
  });

  event.target.closest('li').classList.add('font-blickb');
  
  const filterId = event.target.closest('li').id;

  switch (filterId) {
    case 'filter-by-type-all':
      showElems(elems);
      break;
    case 'filter-by-type-poll':
      showElems(elems.filter(elem => elem.type === 'poll'));
      break;
    case 'filter-by-type-calendar':
      showElems(elems.filter(elem => elem.type === 'calendar'));
      break;
    default:
      console.error("Unknown filter type: " + filterId);
  }

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
  } else if (button.id === "btn-menu-itemactions") {
      //editButtonPressed(id);
      alert("menu item actions");
  }
  else {
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
  type = "poll";
  modalOverlay.style.display = "flex";
  details.style.display = "block";
  modalOverlay.removeAttribute("elem-id");
  menuAddList.classList.remove("is-visible");
  nbAlreadyAnswers = 2;

  detailsTitle.innerHTML = "Nouveau sondage";

  detailsBody.innerHTML = `
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Question</label>
      <input type="text" id="questionTxt" class="w-full h-12 rounded-md border px-4 mb-6" value="">
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

  const questionTxt = document.getElementById("questionTxt");
  questionTxt.value = "";

  console.log(type);
};

const btnNewCalendarPressed = () => {
  type = "calendar";
  modalOverlay.style.display = "flex";
  details.style.display = "block";
  modalOverlay.removeAttribute("elem-id");
  menuAddList.classList.remove("is-visible");
  nbAlreadyAnswers = 2;

  detailsTitle.innerHTML = "Nouveau calendrier";

  detailsBody.innerHTML = `
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Nom du calendrier</label>
      <input type="text" id="questionTxt" class="w-full h-12 rounded-md border px-4 mb-6" value="">
    </div>
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Date et nom de l'évènement</label>
      <input type="date" id="date0" min="2018-01-01" max="2018-12-31" class="w-full h-12 rounded-md border px-4 mb-2">
      <input type="text" id="name0" class="w-full h-12 rounded-md border px-4 mb-6" value="">
    </div>
    <div class="input-group">
      <label class="block text-sm text-gray-400 mb-2">Date et nom de l'évènement</label>
      <input type="date" id="date0" min="2018-01-01" max="2018-12-31" class="w-full h-12 rounded-md border px-4 mb-2">
      <input type="text" id="name0" class="w-full h-12 rounded-md border px-4 mb-6" value="">
    </div>
  `;

  const questionTxt = document.getElementById("questionTxt");
  questionTxt.value = "";

  console.log(type);
};





// ------------------------------------------------------------
// EDIT DATA
// ------------------------------------------------------------
const editButtonPressed = (id) => {
  
  modalOverlay.style.display = "flex";
  details.style.display = "block";
  const elem = getElem(id);
  type = elem.type;
  console.log(type);
  //alert(contact.id);
  nbAlreadyAnswers = 0;
  

  switch (type) {
    case "poll":
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
          <label class="block text-sm text-gray-400 mb-2">Proposition ${index}<span class="block delete-field cursor-pointer bg-gray-200 float-right translate-y-1 p-2"><img src="${iconCross}" alt="supprimer le champ" class="w-2"></span></label>
          <input type="text" id="answer${index}" class="w-full h-12 rounded-md border px-4 mb-6" value="${answer}">
        </div>
        `);
        nbAlreadyAnswers++;
        const questionTxt = document.getElementById("questionTxt");
        questionTxt.value = elem.questionTxt;
      });
      break;
    case "calendar":
      detailsTitle.innerHTML = "Édition d'un calendrier";
      detailsBody.innerHTML = `
        <div class="input-group">
          <label class="block text-sm text-gray-400 mb-2">Nom du calendrier</label>
          <input type="text" id="questionTxt" class="w-full h-12 rounded-md border px-4 mb-6" value="${elem.calName}">
        </div>
      `;
      elem.dates.forEach((event, index) => {
        detailsBody.insertAdjacentHTML('beforeend', `
        <div class="input-group">
          <label class="block text-sm text-gray-400 mb-2">Date et nom de l'évènement ${index}<span class="block delete-field cursor-pointer bg-gray-200 float-right translate-y-1 p-2"><img src="${iconCross}" alt="supprimer le champ" class="w-2"></span></label>
          <input type="date" id="date${index}" class="w-full h-12 rounded-md border px-4 mb-2" value="${event.date}">
          <input type="text" id="name${index}" class="w-full h-12 rounded-md border px-4 mb-6" value="${event.event}">
        </div>
        `);
        nbAlreadyAnswers++;
        const questionTxt = document.getElementById("questionTxt");
        questionTxt.value = elem.calName;
      });
      break;
    default:
      console.error("Unknown type: " + type);
  }

  // detailsTitle.innerHTML = "Édition d'un sondage";

  // detailsBody.innerHTML = `
  //   <div class="input-group">
  //     <label class="block text-sm text-gray-400 mb-2">Question</label>
  //     <input type="text" id="questionTxt" class="w-full h-12 rounded-md border px-4 mb-6" value="${elem.questionTxt}">
  //   </div>
  // `;

  // elem.answers.forEach((answer, index) => {
  //   detailsBody.insertAdjacentHTML('beforeend', `
  //   <div class="input-group">
  //     <label class="block text-sm text-gray-400 mb-2">Proposition ${index}<span class="block delete-field cursor-pointer bg-gray-200 float-right translate-y-1 p-2"><img src="${iconCross}" alt="supprimer le champ" class="w-2"></span></label>
  //     <input type="text" id="answer${index}" class="w-full h-12 rounded-md border px-4 mb-6" value="${answer}">
  //   </div>
  //   `);
  //   nbAlreadyAnswers++;
  // });
  
  const deleteFieldBtn = document.querySelectorAll(".delete-field");
  deleteFieldBtn.forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.target.closest(".input-group").remove();
    });
  });
  

  
  
  
  // answer0.value = elem.answers[0];
  // answer1.value = elem.answers[1];
  //answer2.value = elem.answers[2];


  modalOverlay.setAttribute("elem-id", elem.id);
};

// ------------------------------------------------------------
// ADD FIELD
// ------------------------------------------------------------
const addFieldBtnPressed = (event) => {

  switch (type) {
    case "poll":
      detailsBody.insertAdjacentHTML('beforeend', `
        <div class="input-group">
          <label class="block text-sm text-gray-400 mb-2">Proposition ${nbAlreadyAnswers}</label>
          <input type="text" id="answer${nbAlreadyAnswers}" class="w-full h-12 rounded-md border px-4 mb-6">
        </div>
      `);
      break;
    case "calendar":
      detailsBody.insertAdjacentHTML('beforeend', `
        <div class="input-group">
          <label class="block text-sm text-gray-400 mb-2">Date et nom de l'évènement</label>
          <input type="date" id="date${nbAlreadyAnswers}" class="w-full h-12 rounded-md border px-4 mb-2">
          <input type="text" id="name${nbAlreadyAnswers}" class="w-full h-12 rounded-md border px-4 mb-6">
        </div>
      `);
      break;
    default:
      console.error("Unknown type: " + type);
  }

  // detailsBody.insertAdjacentHTML('beforeend', `
  //   <div class="input-group">
  //     <label class="block text-sm text-gray-400 mb-2">Proposition ${nbAlreadyAnswers}</label>
  //     <input type="text" id="answer${nbAlreadyAnswers}" class="w-full h-12 rounded-md border px-4 mb-6">
  //   </div>
  //   `);
  nbAlreadyAnswers++;

};

// ------------------------------------------------------------
// SAVE DATA ()
// ------------------------------------------------------------
const saveButtonPressed = async () => {
  //checkRequired([questionTxt, answer0, answer1, answer2]);
  // const fields = document.querySelectorAll("#details-body .input-group");
  // fields.forEach((field) => {
  //   alert(field.querySelector("input").value);
  // });
  //alert(type);
  //checkRequired(Array.from(fields));
  showErrorMessages(error);

  if (Object.keys(error).length === 0) {

    switch (type) {
      case "poll":
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
        break;
      case "calendar":
        //alert("calendar");
        if (modalOverlay.getAttribute("elem-id")) {
          // update data
          const docRef = doc(
            db,
            "questions",
            modalOverlay.getAttribute("elem-id")
          );
          //SAUVEGARDE D'UN CALENDAR QUI EXISTE
          try {
              
              
              const fields = document.querySelectorAll("#details-body .input-group");
              const x = [];  
    
              fields.forEach((field, index) => {
                if (index !== 0) {
  
                  const input1Value = field.querySelector("input[type='date']").value;
                  const input2Value = field.querySelector("input[type='text']").value;
                  if (input1Value && input2Value) {
                    x.push({ date: input1Value, name: input2Value });
                  }
                  
                  
  
  
                    // if (inputValue) {
                    // x.push(inputValue);
                    // y.push(0);
                    // }
                }
              });

              alert('ici');
              await updateDoc(docRef, {
                calName: questionTxt.value,
                dates: x.map((event, i) => ({ date: event.date, event: event.name })),
                // answers: x,
                // counters: y,
                timeUpdated: new Date().toISOString().slice(2, 10).replace(/-/g, ''),
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
          // SAUVEGARDE D'UN CALENDAR QUI N'EXISTE PAS ENCORE
          try {
            // alert(answer0.value);
            const fields = document.querySelectorAll("#details-body .input-group");
    
            const x = [];
            //alert(questionTxt.value);
            fields.forEach((field, index) => {
              if (index !== 0) {

                const input1Value = field.querySelector("input[type='date']").value;
                const input2Value = field.querySelector("input[type='text']").value;
                if (input1Value && input2Value) {
                  x.push({ date: input1Value, name: input2Value });
                }
                
                


                  // if (inputValue) {
                  // x.push(inputValue);
                  // y.push(0);
                  // }
              }
            });
            console.log(x);
            await addDoc(dbRef, {
              calName: questionTxt.value,
              dates: x.map((event, i) => ({ date: event.date, event: event.name })),
              // answers: x,
              // counters: y,
              timeCreated: new Date().toISOString().slice(2, 10).replace(/-/g, ''),
              author: auth.currentUser.email, 
              type: 'calendar'
              
            });
    
            // hideModal();
          } catch (err) {
            // setErrorMessage(
            //   "error",
            //   "Unable to add user data to the database. Please try again later"
            // );
            // showErrorMessages();
          }
        }
        break;
      default:
        console.error("Unknown type: " + type);
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
  tempInput.value = `https://storytelling.blick.ch/fr/__is_embed_somewhere/bl-tool-client-quiz/?questionDoc=${id}`; // Set the value to the full URL
  document.body.appendChild(tempInput); // Append to the body
  tempInput.select(); // Select the text
  try {
      document.execCommand("copy"); // Copy the text
      //alert("ID copied to clipboard: " + id);
      alert("URL de l'Iframe copiée !");
  } catch (error) {
      console.error("Failed to copy ID: ", error);
  }
  document.body.removeChild(tempInput); // Clean up by removing the element
};


// https://storytelling.blick.ch/fr/__is_embed_somewhere/bl-tool-client-quiz/?questionDoc=0iz1eP8UNi5Ijpu35v9s







  

  

  

  
  
  

  

  

  

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

const menuUserPressed = () => {
  //event.stopPropagation();
  //console.log("Clicked on:", event.target);
  menuUserList.classList.toggle("is-visible");
};

const menuItemActionsPressed = () => {
  //console.log("menu item actions");

  menuItemActionsList.classList.toggle("is-visible");
};


const addButtonPressed = () => {
  //event.stopPropagation();
  //console.log("Clicked on:", event.target);
  menuAddList.classList.toggle("is-visible");
};



const deleteFieldBtnPressed = () => {
 alert("delete");
};

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
filterByType.addEventListener("click", filterByTypePressed);
addFieldBtn.addEventListener("click", addFieldBtnPressed);
addBtn.addEventListener("click", addButtonPressed);
menuUser.addEventListener("click", menuUserPressed);
//menuItemActions.addEventListener("click", menuItemActionsPressed);
btnNewPoll.addEventListener("click", btnNewPollPressed);
btnNewCalendar.addEventListener("click", btnNewCalendarPressed);
closeBtn.addEventListener("click", closeButtonPressed);
modalOverlay.addEventListener("click", hideModal);
saveBtn.addEventListener("click", saveButtonPressed);
menuUserList.addEventListener("mouseleave", () => {
  menuUserList.classList.remove("is-visible");
});
menuAddList.addEventListener("mouseleave", () => {
  menuAddList.classList.remove("is-visible");
});


// header.addEventListener("mouseenter", () => {
//   console.log("HELLO");
// });


const searchBar = document.getElementById('searchbar');
const search = (event) => {
  let input = searchBar.value.toLowerCase();
  let x = document.getElementsByClassName('elem-list-item');

  for (let i = 0; i < x.length; i++) {
      let title = x[i].querySelector('.card-title');
      if (title && !title.innerHTML.toLowerCase().includes(input)) {
          x[i].style.display = "none";
      } else {
          x[i].style.display = "list-item";
      }
  } 
};
searchBar.addEventListener('keyup', search);

