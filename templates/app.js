var taskTitleInput=document.getElementById("newtasktitle");
var taskDescriptionInput=document.getElementById("newtaskdescription");
var taskDeadlineInput=document.getElementById("newtaskdeadline");
var addButton=document.getElementById("createtaskbutton");
var incompleteTaskHolder=document.getElementById("incomplete-tasks");
var completedTasksHolder=document.getElementById("completed-tasks");


$.getJSON("http://127.0.0.1:5000/task", function( json ) {
  //console.log(json)
  //console.log(json.length)
  for (var i = 0; i < json.length; i++) {
    var listItem=createNewTaskElement(json[i].id,json[i].title,json[i].description,json[i].deadline,
    json[i].completed_at);
    if(json[i].completed_at == null){
        incompleteTaskHolder.appendChild(listItem);
    }else{
        completedTasksHolder.appendChild(listItem);
    }
}
for (var i=0; i<incompleteTaskHolder.children.length;i++){
	bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
}
for (var i=0; i<completedTasksHolder.children.length;i++){
	bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
}

addButton.onclick=addTask;
});

var createNewTaskElement=function(id,taskTitle,taskDescription,taskDeadline,taskCompletedAt){
	var listItem=document.createElement("li");

	var checkBox=document.createElement("input");
	var label=document.createElement("label");
	var label2=document.createElement("label");
	var label3=document.createElement("label");
	var editInputTitle=document.createElement("input");
	var editInputDescription=document.createElement("input");
	var editInputDeadline=document.createElement("input");
	var hiddenID=document.createElement("input");
	var label4=document.createElement("label");
	var editButton=document.createElement("button");
	var deleteButton=document.createElement("button");

    label.innerText=taskTitle;
	label2.innerText=taskDescription;
	label3.innerText= new Date(taskDeadline).toLocaleString();//taskDeadline;
	if (taskCompletedAt!=null) label4.innerText= new Date(taskCompletedAt).toLocaleString();
	//hiddenID.setAttribute("type","hidden");
	//hiddenID.setAttribute("value",id);

	hiddenID.type = "hidden";
	hiddenID.value = id;
	checkBox.type="checkbox";
	if(taskCompletedAt!=null) checkBox.checked="true";
	editInputTitle.type="text";
	editInputDescription.type="text";
	editInputDeadline.type="text";
	editButton.innerText="Edit";
	editButton.className="edit";

	deleteButton.innerText="Delete";
	deleteButton.className="delete";

	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(label2);
	listItem.appendChild(label3);
	listItem.appendChild(editInputTitle);
	listItem.appendChild(editInputDescription);
	listItem.appendChild(editInputDeadline);
	listItem.appendChild(hiddenID);
	listItem.appendChild(label4);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	return listItem;
}

var addTask=function(){
	//var listItem=createNewTaskElement("id",taskTitleInput.value,taskDescriptionInput.value,taskDeadlineInput.value);
	//incompleteTaskHolder.appendChild(listItem);
	//bindTaskEvents(listItem, taskCompleted);
    $.ajax
        ({
            type: "POST",
            url: 'http://127.0.0.1:5000/task',
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify({
                    "title": taskTitleInput.value,
                    "description": taskDescriptionInput.value,
                    "deadline": taskDeadlineInput.value
             }),
            success: function (taskResponse) {
                    var listItem=createNewTaskElement(taskResponse.id,taskTitleInput.value,taskDescriptionInput.value,taskDeadlineInput.value,null);
                    incompleteTaskHolder.appendChild(listItem);
                    bindTaskEvents(listItem, taskCompleted);
                    taskTitleInput.value="";
                    taskDescriptionInput.value="";
                    taskDeadlineInput.value="";
                    alert("Sucessfull Created New Task");
            },
            error: function () {
                alert("Error to Create New Task");
            }
        })
}

var editTask=function(){
    var listItem=this.parentNode;
    var editInput=listItem.children[4];
    var editInput2=listItem.children[5];
    var editInput3=listItem.children[6];
    var label=listItem.childNodes[1]
    var label2=listItem.childNodes[2]
    var label3=listItem.childNodes[3]
    var containsClass=listItem.classList.contains("editMode");
    if(containsClass){
        label.innerText=editInput.value;
        label2.innerText=editInput2.value;
        label3.innerText=editInput3.value;

       $.ajax({
            type: "PUT",
            url: 'http://127.0.0.1:5000/task/'+listItem.childNodes[7].value,
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify({
                    "title": editInput.value,
                    "description": editInput2.value,
                    "deadline": editInput3.value
             }),
            success: function (taskResponse) {
                    alert("Sucessfull Edited a Task");
            },
            error: function () {
                alert("Error to Edit a Task");
            }
       })
    }else{
        editInput.value=label.innerText;
        editInput2.value=label2.innerText;
        editInput3.value=label3.innerText;
    }
    listItem.classList.toggle("editMode");
}

var deleteTask=function(){
		var listItem=this.parentNode;
		var ul=listItem.parentNode;
		ul.removeChild(listItem);
		$.ajax
        ({
            type: "DELETE",
            url: 'http://127.0.0.1:5000/task/'+listItem.childNodes[7].value,
            dataType: 'json',
            async: false,
            success: function (taskResponse) {
                    alert("Sucessfull Deleted a task")
            },
            error: function () {
                alert("Error to Delete a Task");
            }
        })
}

var taskCompleted=function(){
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
        $.ajax
        ({
            type: "POST",
            url: 'http://127.0.0.1:5000/complete_task/'+listItem.childNodes[7].value,
            dataType: 'json',
            async: false,
            success: function (taskResponse) {
            listItem.childNodes[8].innerText= new Date(taskResponse.completed_at).toLocaleString();
                alert("Sucessfull Completed a task")
            },
            error: function () {
                alert("Error to Complete a Task");
            }
        })
}

var taskIncomplete=function(){
	var listItem=this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem,taskCompleted);
	listItem.childNodes[8].innerText=""
	  $.ajax
        ({
            type: "POST",
            url: 'http://127.0.0.1:5000/incomplete_task/'+listItem.childNodes[7].value,
            dataType: 'json',
            async: false,
            success: function (taskResponse) {
                alert("Sucessfull Incompleted a task")
            },
            error: function () {
                alert("Error to Incomplete a Task");
            }
        })
}

var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
	var checkBox=taskListItem.querySelector("input[type=checkbox]");
	var editButton=taskListItem.querySelector("button.edit");
	var deleteButton=taskListItem.querySelector("button.delete");
	editButton.onclick=editTask;
	deleteButton.onclick=deleteTask;
	checkBox.onchange=checkBoxEventHandler;
}