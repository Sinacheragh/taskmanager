
async function fetchtasks() {
    const data = await fetch('https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks')
    const tasks = await data.json()

    tasks.forEach(task => {
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
        
    });
}
fetchtasks();




