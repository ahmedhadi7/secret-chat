import {
    addDoc,
    collection,
    db,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from "./firebase.js";



console.log("script loaded");



// قراءة الغرفة من الرابط

const urlParams =
new URLSearchParams(window.location.search);


const roomId =
urlParams.get("room");



if(!roomId){

    alert("رابط المحادثة غير صحيح");

    throw new Error("Room missing");

}




// العناصر

const loginBox =
document.getElementById("loginBox");

const chatBox =
document.getElementById("chatBox");

const usernameInput =
document.getElementById("username");

const passwordInput =
document.getElementById("password");

const loginBtn =
document.getElementById("loginBtn");

const errorMessage =
document.getElementById("errorMessage");

const messagesBox =
document.getElementById("messages");

const messageInput =
document.getElementById("messageInput");

const sendBtn =
document.getElementById("sendBtn");


// هنا فقط ضع كود تكبير الحقل

messageInput.addEventListener(
"input",
()=>{

    messageInput.style.height = "auto";

    messageInput.style.height =
    messageInput.scrollHeight + "px";

});




let username = "";





// تسجيل الدخول


loginBtn.onclick = async()=>{


    const name =
    usernameInput.value.trim();


    const password =
    passwordInput.value.trim();



    if(name===""){

        errorMessage.innerHTML =
        "اكتب اسمك";

        return;

    }



    try{


        const roomRef =
        doc(
            db,
            "rooms",
            roomId
        );



        const roomSnap =
        await getDoc(roomRef);



        if(!roomSnap.exists()){


            errorMessage.innerHTML =
            "الغرفة غير موجودة";


            return;

        }




        if(password !== roomSnap.data().password){


            errorMessage.innerHTML =
            "❌ كلمة المرور خطأ";


            return;

        }





        username=name;
        localStorage.setItem(
    "secret_username",
    username
);



        loginBox.classList.add("hidden");

        chatBox.classList.remove("hidden");



        loadMessages();



    }

    catch(error){

        console.log(error);

        errorMessage.innerHTML =
        "خطأ في الاتصال";

    }



};







// تحميل الرسائل


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


async(snapshot)=>{


messagesBox.innerHTML="";



for(const messageDoc of snapshot.docs){



    const data =
    messageDoc.data();



    // تحويل الرسالة إلى مقروءة

    if(

        data.sender !== username

        &&

        data.read === false

    ){

        console.log("mark as read", messageDoc.id);


        await updateDoc(


            doc(

                db,

                "rooms",

                roomId,

                "messages",

                messageDoc.id

            ),


            {


                read:true,


                readTime:
                serverTimestamp()


            }


        );


    }





    const div =
    document.createElement("div");



    div.className =
    "message " +

    (

        data.sender === username

        ?

        "my-message"

        :

        "other-message"

    );






    let status="";



    if(data.sender === username){


        if(data.read){


            status =
            "✓✓ تمت القراءة";


            if(data.readTime){


                const time =
                data.readTime
                .toDate()
                .toLocaleTimeString("ar-IQ");


                status +=
                " - " + time;


            }



        }

        else{


            status =
            "✓ تم الإرسال";


        }


    }





    div.innerHTML = `


    <div class="message-name">

    ${data.sender}

    </div>



    <div class="message-text">

    ${data.text}

    </div>



    <div class="message-info">

    ${status}

    </div>


    `;



    messagesBox.appendChild(div);



}



messagesBox.scrollTop =
messagesBox.scrollHeight;



}



);


}








// إرسال رسالة


sendBtn.onclick = async()=>{


    const text =
    messageInput.value.trim();



    if(text===""){

        return;

    }



    try{


        await addDoc(


            collection(

                db,

                "rooms",

                roomId,

                "messages"

            ),



            {


                sender:username,


                text:text,


                time:
                serverTimestamp(),


                read:false,


                readTime:null


            }


        );



        messageInput.value="";


    }


    catch(error){


        console.log(
            "Send error",
            error
        );


    }



};