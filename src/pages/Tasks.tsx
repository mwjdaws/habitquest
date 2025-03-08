
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { CreateTaskData, Task, UpdateTaskData } from "@/lib/taskTypes";
import { useAuth } from "@/contexts/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, isLoading, addTask, editTask, removeTask, toggleCompletion } = useTasks();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleCreateTask = async (data: CreateTaskData) => {
    await addTask(data);
    setShowForm(false);
  };
  
  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (!editingTask) return;
    await editTask(editingTask.id, data);
    setEditingTask(null);
  };
  
  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };
  
  const handleToggleComplete = async (taskId: string, currentStatus: string) => {
    await toggleCompletion(taskId, currentStatus);
  };
  
  const handleDelete = async (taskId: string) => {
    await removeTask(taskId);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };
  
  // Show appropriate UI based on authentication state
  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>Sign in to manage your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be signed in to create and manage tasks.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Task management header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        
        <Button onClick={() => {
          setShowForm(true);
          setEditingTask(null);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      {/* Task creation/editing form */}
      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
          initialData={editingTask || undefined}
          title={editingTask ? "Edit Task" : "Create New Task"}
        />
      )}
      
      {/* Task list */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>Manage your tasks and track your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
