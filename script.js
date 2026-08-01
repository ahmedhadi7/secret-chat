import {
    collection,
    db,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query
} from "./firebase.js";

console.log("script loaded");



// قراءة الغرفة من الرابط

const urlParams = new URLSearchParams(window.location.search);

const roomId = urlParams.get("room");
if(!roomId){

    alert("رابط المحادثة غير صحيح");

    throw new Error("Room ID is missing");

}




// العناصر

const loginBox = document.getElementById("loginBox");

const chatBox = document.getElementById("chatBox");


const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");


const loginBtn = document.getElementById("loginBtn");


const messageInput = document.getElementById("messageInput");

const sendBtn = document.getElementById("sendBtn");


const messagesBox = document.getElementById("messages");

const errorMessage = document.getElementById("errorMessage");








// المستخدم

let username = "";





// الدخول

loginBtn.onclick = async () => {


    const name = usernameInput.value.trim();

    const password = passwordInput.value.trim();



    if(name === ""){

        errorMessage.innerHTML =
        "اكتب اسمك";

        return;

    }



    const roomRef = doc(
        db,
        "rooms",
        roomId
    );



    const roomSnap = await getDoc(roomRef);



    if(!roomSnap.exists()){

        errorMessage.innerHTML =
        "❌ المحادثة غير موجودة";

        return;

    }



    const correctPassword =
    roomSnap.data().password;



    if(password !== correctPassword){


        errorMessage.innerHTML =
        "❌ رمز الدخول غير صحيح";


        return;

    }



    username = name;



    localStorage.setItem(
        "secret_username",
        username
    );



    loginBox.classList.add("hidden");

    chatBox.classList.remove("hidden");


    loadMessages();


};






// استقبال الرسائل

function loadMessages(){


const messagesQuery = query(

    collection(
        db,
        "rooms",
        roomId,
        "messages"
    ),

    orderBy(
        "time",
        "asc"
    )

);



onSnapshot(

messagesQuery,

(snapshot)=>{


messagesBox.innerHTML = "";



snapshot.forEach((doc)=>{


const data = doc.data();



const div =
document.createElement("div");



div.className =
"message " +

(data.sender === username
?
"my-message"
:
"other-message");



div.innerHTML = `

<div class="message-name">

${data.sender}

</div>


${data.text}

`;



messagesBox.appendChild(div);



});



messagesBox.scrollTop =
messagesBox.scrollHeight;



}

);



}