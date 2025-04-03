
async function fetchTasks() {
    const data = await fetch('https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks')
    const tasks = await data.json()
    tasks.forEach(task => {
            if (select.value == "all" || select.value == task.taskstatus){
            let taskTemp;

            if (task.taskstatus == "readyToStart")taskTemp = readyToStart
            else if (task.taskstatus == "inProgress")taskTemp = inProgress
            else if (task.taskstatus == "finished")taskTemp = finished
            else if (task.taskstatus == "expired")taskTemp = expired

            taskTemp.querySelector("#title").innerHTML = task.taskTitle
            taskTemp.querySelector("#expiryDate").innerHTML = "Expiry Date: " + task.taskExpiryDate
            
            if (task.taskdifficulty == "easy")taskTemp.querySelector('#difficulty').innerHTML = document.getElementById("easy").innerHTML
            else if (task.taskdifficulty == "normal")taskTemp.querySelector('#difficulty').innerHTML = document.getElementById("normal").innerHTML
            else if (task.taskdifficulty == "hard")taskTemp.querySelector('#difficulty').innerHTML = document.getElementById("hard").innerHTML
            else if (task.taskdifficulty == "RIP")taskTemp.querySelector('#difficulty').innerHTML = document.getElementById("RIP").innerHTML
            
            if (task.taskPriority == "mustDo")mustDo.innerHTML += taskTemp.innerHTML
            else if (task.taskPriority == "shouldDo") shouldDo.innerHTML += taskTemp.innerHTML
            else if (task.taskPriority == "couldDo")couldDo.innerHTML += taskTemp.innerHTML
            else if (task.taskPriority == "ifIHaveTime")ifIHaveTime.innerHTML += taskTemp.innerHTML
        }
        
    })
}
fetchTasks()
function filter(){
    location.reload()
}
select.addEventListener("change",filter)



document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('default-modal');
    const openButtons = document.querySelectorAll('[data-modal-toggle="default-modal"]');
    const closeButtons = document.querySelectorAll('[data-modal-hide="default-modal"]');
    
    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.classList.toggle('hidden');
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    });
});


async function fetchHistories() {
    const data = await fetch('https://67e2e31497fc65f53538034c.mockapi.io/api/v1/history')
    const histories = await data.json()
    histories.forEach(task => {
        temp = document.getElementById("history")
        temp.querySelector("#title").innerHTML = task.taskTitle
        temp.querySelector("#status").innerHTML = task.taskstatus
        document.getElementById("histories").innerHTML += temp.innerHTML
    })
}
fetchHistories()
