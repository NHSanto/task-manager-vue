export async function fetchTasks(userObj, page = 0, size = 10) {
    const currentUser = JSON.parse(JSON.stringify(userObj));
    const response = await fetch(`http://localhost:8080/tasks/all/creator/${currentUser?.userId}?page=${page}&size=${size}`, {
        headers: {
            'Authorization': `Bearer ${currentUser?.accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load tasks")
    }

    return await response.json()
}

export async function createTask(taskData, accessToken) {
    const response = await fetch("http://localhost:8080/tasks/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify(taskData)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create task")
    }

    return await response.json()
}

export async function updateTaskStatus(taskId, status, accessToken) {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify({ name: status })
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update task status")
    }

    return await response.json()
}

export async function deleteTask(taskId, accessToken) {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error("Failed to delete task")
    }
}