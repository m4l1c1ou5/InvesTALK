const socket= io();

const $messages=document.querySelector('#messages');
const messagetemplate=document.querySelector('#message-template').innerHTML;
const locationtemplate=document.querySelector('#location-template').innerHTML;

let {name , hashtag }= Qs.parse(location.search,{ignoreQueryPrefix:true});


socket.on("message",(msg)=>{
    let html=Mustache.render(messagetemplate,{
        name:msg.createdBy,
        message:msg.message,
        time:moment(msg.createdAt).format('hh:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
})

socket.on("share-location",(url)=>{
    let html=Mustache.render(locationtemplate,{
        name:url.createdBy,
        location:url.message,
        time: moment(url.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
})

socket.emit('join',{ name ,hashtag });

const $messageForm=document.querySelector('#chat');
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button');

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const msg=e.target.elements.msg.value;
    socket.emit('new_msg',msg,{ name ,hashtag },()=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value='';
        $messageFormInput.focus();
        console.log("Message sent!");
    });
})
const $location=document.querySelector('#sendlocation');
$location.addEventListener('click',()=>{
    $location.setAttribute('disabled', 'disabled');
    if(!navigator.geolocation){
        $location.removeAttribute('disabled');
        return alert('not working');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('share-location',position.coords.latitude,position.coords.longitude,{ name ,hashtag },()=>{
            console.log("location sent successfully");
        });
        $location.removeAttribute('disabled');
    })
})
