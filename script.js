function compareDates(dateStr1, dateStr2) {
    // تبدیل تاریخ‌ها به فرمت YYYY-MM-DD برای مقایسه صحیح
    const formatDate = (dateStr) => {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };
    
    const formattedDate1 = formatDate(dateStr1);
    const formattedDate2 = formatDate(dateStr2);
    
    if (formattedDate1 > formattedDate2) return 1;
    if (formattedDate1 < formattedDate2) return -1;
    return 0;
}
async function fetchTasks() {
    try {
        const response = await fetch('https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const tasks = await response.json();
        const today = dayjs().startOf('day');
        
        // پاک کردن محتوای قبلی
        ['mustDo', 'shouldDo', 'couldDo', 'ifIHaveTime'].forEach(id => {
            document.getElementById(id).innerHTML = `<p class="text-[25px]">${id.split(/(?=[A-Z])/).join(' ')}</p>`;
        });
        
        tasks.forEach(task => {
            if (select.value === "all" || select.value === task.taskstatus) {
                let taskTemplate = getTaskTemplate(task.taskstatus);
                if (!taskTemplate) return;
                
                // پر کردن اطلاعات تسک
                fillTaskDetails(taskTemplate, task);
                
                // بررسی تاریخ انقضا
                if (task.taskstatus !== "finished" && today.isAfter(dayjs(task.taskExpiryDate, "MM/DD/YYYY"))) {
                    taskTemplate = expired.cloneNode(true);
                    fillTaskDetails(taskTemplate, task);
                }
                
                // اضافه کردن به بخش مربوطه
                document.getElementById(task.taskPriority).innerHTML += taskTemplate.innerHTML;
            }
        });
        
        setupEventListeners(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please try again later.');
    }
}
fetchTasks()


// توابع کمکی
function getTaskTemplate(status) {
    const templates = {
        readyToStart: document.getElementById('readyToStart'),
        inProgress: document.getElementById('inProgress'),
        finished: document.getElementById('finished'),
        expired: document.getElementById('expired')
    };
    return templates[status]?.cloneNode(true);
}

function fillTaskDetails(template, task) {
    template.querySelector("#title").textContent = task.taskTitle;
    template.querySelector("#expiryDate").textContent = "Expiry Date: " + task.taskExpiryDate;
    
    const difficultyElement = template.querySelector('#difficulty');
    if (difficultyElement) {
        const difficultyIcon = document.getElementById(task.taskdifficulty)?.innerHTML;
        if (difficultyIcon) difficultyElement.innerHTML = difficultyIcon;
    }
    
    const detailsElement = template.querySelector("#details");
    if (detailsElement) detailsElement.textContent = task.taskDetails;
    
    // تنظیم ID برای دکمه‌ها
    template.querySelectorAll(".del, .ed, .finished, .remhis, .start-btn").forEach(btn => {
        btn.id = task.id;
    });
    template.querySelectorAll(".ed").forEach(btn => {
        btn.id = task.id;
        btn.dataset.taskId = task.id;
    });
}

function setupEventListeners(tasks) {
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('ed')) {
            event.preventDefault();
            const taskId = event.target.id;
            await openEditModal(taskId);
        }
    });
    // حذف تسک
    document.querySelectorAll('.del').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                await axios.delete(`https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks/${button.id}`);
                location.reload();
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task.');
            }
        });
    });
    
    // تکمیل تسک
    document.querySelectorAll(".finished").forEach(btn => {
        btn.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                const task = tasks.find(t => t.id === btn.id);
                if (!task) throw new Error('Task not found');
                
                const updatedTask = {...task, taskstatus: "finished"};
                await axios.put(
                    `https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks/${updatedTask.id}`,
                    updatedTask
                );
                location.reload();
            } catch (error) {
                console.error('Error updating task:', error);
                alert('Failed to mark task as finished.');
            }
        });
    });
    document.querySelectorAll('.start-btn').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const taskId = btn.id;
                const task = tasks.find(t => t.id === taskId);
                
                if (!task) {
                    throw new Error('تسک مورد نظر یافت نشد');
                }
                
                // آپدیت وضعیت تسک
                const updatedTask = {
                    ...task,
                    taskstatus: "inProgress"
                };
                
                // ارسال درخواست به API
                await axios.put(
                    `https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks/${taskId}`,
                    updatedTask
                );
                
                // ریلود صفحه برای نمایش تغییرات
                location.reload();
                
            } catch (error) {
                console.error('خطا در آپدیت تسک:', error);
                alert('خطا در شروع تسک!');
            }
        });
    });
    document.querySelectorAll('.ed').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            event.preventDefault();
            await openEditModal(btn.id);
        });
    });
}
document.getElementById("addtask").addEventListener("click", async function(event) {
    event.preventDefault();
    
    const formData = {
        taskTitle: document.getElementById('floating_standard').value,
        taskPriority: document.querySelector('input[name="list-radio1"]:checked').value,
        taskstatus: 'readyToStart',
        taskdifficulty: document.querySelector('input[name="list-radio3"]:checked').value,
        taskExpiryDate: document.getElementById('default-datepicker').value,
        taskDetails: document.getElementById('det').value
    };
    
    // اعتبارسنجی داده‌ها
    if (!formData.taskTitle || !formData.taskExpiryDate) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        const response = await fetch('https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to add task');
        
        alert('Task added successfully!');
        document.querySelector('form').reset();
        document.getElementById('default-modal').classList.add('hidden');
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting task. Please try again.');
    }
});
async function openEditModal(taskId) {
    try {
        const response = await fetch(`https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks/${taskId}`);
        if (!response.ok) throw new Error('Task not found');
        
        const task = await response.json();
        
        // پر کردن فرم با اطلاعات
        document.getElementById('floating_standard').value = task.taskTitle;
        document.querySelector(`input[name="list-radio1"][value="${task.taskPriority}"]`).checked = true;
        document.querySelector(`input[name="list-radio3"][value="${task.taskdifficulty}"]`).checked = true;
        document.getElementById('default-datepicker').value = task.taskExpiryDate;
        document.getElementById('det').value = task.taskDetails;

        // تغییر حالت به ویرایش
        isEditMode = true;
        currentEditingId = taskId;

        // نمایش دکمه مناسب
        document.getElementById('addtask').classList.add('hidden');
        document.getElementById('saveChanges').classList.remove('hidden');

        // باز کردن مودال
        const modal = document.getElementById('default-modal');
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load task for editing');
    }
}
document.getElementById("saveChanges").addEventListener("click", async function(event) {
    event.preventDefault();
    
    const formData = {
        taskTitle: document.getElementById('floating_standard').value,
        taskPriority: document.querySelector('input[name="list-radio1"]:checked').value,
        taskdifficulty: document.querySelector('input[name="list-radio3"]:checked').value,
        taskExpiryDate: document.getElementById('default-datepicker').value,
        taskDetails: document.getElementById('det').value
    };
    
    if (!formData.taskTitle || !formData.taskExpiryDate) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        const response = await fetch(`https://67e2e31497fc65f53538034c.mockapi.io/api/v1/tasks/${currentEditingId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        alert('Task updated successfully!');
        document.querySelector('form').reset();
        document.getElementById('default-modal').classList.add('hidden');
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating task. Please try again.');
    }
});
document.querySelectorAll('[data-modal-hide="default-modal"]').forEach(button => {
    button.addEventListener('click', () => {
        isEditMode = false;
        currentEditingId = null;
        document.getElementById('addtask').classList.remove('hidden');
        document.getElementById('saveChanges').classList.add('hidden');
        document.querySelector('form').reset();
    });
});