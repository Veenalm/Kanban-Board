let modelcont = document.querySelector(".model-cont");
let addbtn= document.querySelector(".add-btn");
let maincont = document.querySelector(".main-cont");
let taskdetail =document.querySelector(".textarea-cont");
let taskcont = document.querySelector(".task-container");
let submitbtn = document.querySelector(".task-container button")
let priorityTaskColor = document.querySelectorAll(".priority-task-cont");
let toolboxcolor = document.querySelectorAll(".color");
let deletebtn = document.querySelector(".remove-btn");
let addTaskFlag =false;
let deletetaskflag = false;
let activePriorityTaskColor = "";
let activeToolBoxColor="all";
let ogtickets =[];
let shortid =1;
let colors = ["lightpink","lightblue", "lightgreen", "black"]
let ticketfromlocalStorage =  JSON.parse(localStorage.getItem("ogtickets"));
if(ticketfromlocalStorage)
{
    ogtickets= ticketfromlocalStorage;
    console.log(ogtickets);
    refreshMainCont();
}
function getFilteredTickets(){
    if(activeToolBoxColor==="all"){
        return ogtickets;
    }
    else{
        let filteredTickets = ogtickets.filter(({color})=>
        color === activeToolBoxColor);
        return filteredTickets
    }

}

function refreshMainCont(){
maincont.innerHTML = "";
let filteredogtickets = getFilteredTickets();
filteredogtickets.forEach(function (ticket){
    const {id, task, color} = ticket;
    createTicket({tickettask : task, ticketcolor:color, ticketid:id });
    
 
});
}


function clearSelectedPriorityColor(){
    priorityTaskColor.forEach(function(elem){ //prioritytaskcolor: text area color
        if(elem.classList.contains("active")){
           elem.classList.remove("active");
        }

       });

}
function clearToolboxColor(){
    toolboxcolor.forEach(function(elem){
        if(elem.classList.contains("active")){
           elem.classList.remove("active");
        }

       });

}
function toggleModel(){
    console.log("Script is running");
    //console.log(modelcont.style.display="flex");
    
    if(addTaskFlag){
        modelcont.style.display="none";
        activePriorityTaskColor ="";
        taskdetail.value="";
        clearSelectedPriorityColor();
        
        
    }
    else{
        modelcont.style.display="flex";
    }
    addTaskFlag=!addTaskFlag;
}
addbtn.addEventListener("click", toggleModel);
//toggleModel();}
deletebtn.addEventListener("click", deletetogglemode);
 
function deletetogglemode(){
  deletetaskflag =!deletetaskflag;
  if(deletetaskflag){
    alert("delete btn activated");
    deletebtn.style.color ="red";
  }
  else{
    alert("delete btn deactivated")
    deletebtn.style.color ="white";
  }
}

function handleLock(ticketid, ticketelem){
    //console.log("ticketid:"&{ticketid}, ticketelem );
    let lock = ticketelem.querySelector(".lockcls i");
    const ticketTaskArea =ticketelem.querySelector(".task-area");
    const lockClose = "fa-lock";
    const lockOpen = "fa-lock-open";
    lock.addEventListener("click", ()=>{
        if(lock.classList.contains(lockClose)){
            lock.classList.remove(lockClose);
            lock.classList.add(lockOpen);
            ticketTaskArea.setAttribute("contenteditable" , "true");

        }
        else{
            lock.classList.remove(lockOpen);
            lock.classList.add(lockClose);
            ticketTaskArea.setAttribute("contenteditable" , "false");
            let idx = ogtickets.findIndex((ticket)=>{
                return ticket.id ===ticketid;
            });
            console.log(ticketTaskArea.textContent);
            ogtickets[idx].task =ticketTaskArea.textContent;
            updateLocalStorage();

        }
         

    });


}
function handlecolor(ticketid, ticketelem){
    let ticketcolorelem= ticketelem.querySelector(".ticket-clr");
    ticketcolorelem.addEventListener("click", function(){
     let currentColor = ticketcolorelem.classList[1];
     console.log(currentColor);
     let clridx = colors.findIndex((color)=> {
        return currentColor===color;

     });
     let newclrIndex = ++clridx % colors.length;
     let newcolor = colors[newclrIndex];
     ticketcolorelem.classList.remove(currentColor);
     ticketcolorelem.classList.add(newcolor);
     console.log(newcolor);
     let idx = ogtickets.findIndex((ticket)=>{
        return ticketid === ticket.id;

     });
     
      ogtickets[idx].color = newcolor;
      updateLocalStorage();
      //console.log(ogtickets[idx].color);
     
    });
}

function handledelete(ticketid, ticketelem){
    ticketelem.addEventListener("click", ()=>{
        if(deletetaskflag){
           ticketelem.remove();
        ogtickets = ogtickets.filter((ticket)=>{
            return ticket.id !== ticketid;

        });
        updateLocalStorage();
      }

        else{
            console.log("ignore");
        }
        

    });
}


function createTicket({tickettask, ticketcolor, ticketid } ){
    let ticketcont = document.createElement("div");
   
    ticketcont.setAttribute("class", "ticket-cont");
    ticketcont.innerHTML =`<div class= "ticket-clr ${ticketcolor}"></div>
    <div class= "ticket-id"> ${ticketid} </div>
    <div class= "task-area">${tickettask}</div>
    <div class = "lockcls"><i class="fa-solid fa-lock"></i></div>`;
    
    
    console.log(ticketcont);
    maincont.append(ticketcont);
    handleLock(ticketid, ticketcont);
    handlecolor(ticketid, ticketcont);
    handledelete(ticketid, ticketcont);
    

}
//createTicket( {tickettask:"Task 1",  ticketcolor:"lightblue", ticketid:"#1234" });
//createTicket( {tickettask:"Task 2",  ticketcolor:"lightgreen", ticketid:"#1234" });

submitbtn.addEventListener("click",function(){
    if(activePriorityTaskColor && taskdetail.value){
    console.log(taskdetail.value,activePriorityTaskColor);
    ogtickets.push({task:taskdetail.value , color:activePriorityTaskColor, id:shortid++ });
    updateLocalStorage();
    toggleModel();
    refreshMainCont();
    
    
}
});
function OnPriorityColorClickModel(event){
    clearSelectedPriorityColor();
    const target =event.target;
    target.classList.add("active");
    const classes = target.getAttribute("class");
    
    const selectedColor = classes.split(" ")[0];
        //console.log(selectedColor);
    activePriorityTaskColor=selectedColor;
}

priorityTaskColor.forEach(function(elem){
   elem.addEventListener("click", OnPriorityColorClickModel);
    //console.log(event.target); 
 
});
function onClickToolBoxColor(event){
    console.log("inside toolbox")
    clearToolboxColor();
    const target =event.target;
    target.classList.add("active");
    const classes = target.getAttribute("class");
    
    const selectedColor = classes.split(" ")[0];
        //console.log(selectedColor);
    activeToolBoxColor=selectedColor;
    console.log(activeToolBoxColor);
    refreshMainCont();
}

toolboxcolor.forEach(function(elem){
    elem.addEventListener("click",onClickToolBoxColor);
});

function updateLocalStorage(){
   localStorage.setItem("ogtickets", JSON.stringify(ogtickets));
}