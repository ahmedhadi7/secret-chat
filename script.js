import {
  addDoc,
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "./firebase.js";

console.log("script loaded");



// قراءة الغرفة من الرابط

const urlParams = new URLSearchParams(window.location.search);

const roomId = urlParams.get("room");



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



// كلمة المرور

const CHAT_PASSWORD = "2580";



// المستخدم

let username = "";





// الدخول

loginBtn.onclick = () => {


    console.log("button clicked");

const name = usernameInput.value.trim();

const password = passwordInput.value.trim();

console.log(name, password);



    if(password !== CHAT_PASSWORD){

        errorMessage.innerHTML =
        "❌ كلمة المرور غير صحيحة";

        return;

    }



    if(name === ""){

        errorMessage.innerHTML =
        "اكتب اسمك";

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




// تحميل الاسم المحفوظ

const savedName = localStorage.getItem(
    "secret_username"
);


if(savedName){

    usernameInput.value = savedName;

}




// إرسال رسالة

sendBtn.onclick = async () => {


    const text =
    messageInput.value.trim();



    if(text === "")
    return;



    await addDoc(

        collection(
            db,
            "rooms",
            roomId,
            "messages"
        ),

        {

            sender: username,

            text: text,

            time: serverTimestamp()

        }

    );



    messageInput.value = "";

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