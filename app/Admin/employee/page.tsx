'use client'
import { useState, useEffect } from "react";
import EmployeeCard from "./_components/employeeCard";
import { AddEmployeeDialog } from "./_components/addEmployee";
import EmployeeCardSkeleton from "./_components/EmployeeCardSkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ViewEmployeeDialog } from "./_components/viewEmployee";
import { Input } from "@/components/ui/input";

interface Employee {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  phoneNumber: string;
  role: string;
  email: string;
  password: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

const EmployeePage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false); // Separate state for Add Dialog
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/users"); // Update this to your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data.users || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployeeClick = () => {
    setAddDialogVisible(true); // Open Add Dialog
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setAddDialogVisible(false); // Close both dialogs
  };

  const handleCardClick = (employee: Employee) => {
    setSelectedEmployee(employee); // Set the selected employee data
    setDialogVisible(true); // Open Edit dialog (View/Edit)
  };

  const handleEmployeeAdded = (newEmployee: Employee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  const handleEmployeeEdited = (updatedEmployee: Employee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      )
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <EmployeeCardSkeleton />
        <EmployeeCardSkeleton />
        <EmployeeCardSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Search Employee..."
          className="w-full sm:w-[80px] md:w-[140px] lg:w-[600px]"
        />
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button onClick={handleAddEmployeeClick} className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>
      <div className="relative overflow-x-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onClick={() => handleCardClick(employee)} // Pass the selected employee data to the handler
            />
          ))}
        </div>
      </div>

      {/* Add Employee Dialog */}
      {addDialogVisible && (
        <AddEmployeeDialog
          visible={addDialogVisible}
          onClose={closeDialog}
          // onEmployeeAdded={handleEmployeeAdded} // Pass the handler to update the employee list
        />
      )}

      {/* Edit Employee (View) Dialog */}
      {dialogVisible && selectedEmployee && (
        <ViewEmployeeDialog
          visible={dialogVisible}
          onClose={closeDialog}
          selectedEmployee={selectedEmployee} // Pass the selected employee data to the dialog
          onEmployeeEdited={handleEmployeeEdited} // Pass the handler to update the employee details
        />
      )}
    </div>
  );
};

export default EmployeePage;
