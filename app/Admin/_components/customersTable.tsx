'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";

const invoices = [
    {
        id: "ID001",
        fullName: "Megersa Biratu Muleta",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Paid'
    },
    {
        id: "ID002",
        fullName: "Wakjira Nagara Bashana",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Not Paid'
    },
    {
        id: "ID003",
        fullName: "Abdi Diribsa Legese",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Paid'
    },
    {
        id: "ID004",
        fullName: "Megersa Biratu Muleta",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Paid'
    },
    {
        id: "ID005",
        fullName: "Megersa Biratu Muleta",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Not Paid'
    },
    {
        id: "ID006",
        fullName: "Megersa Biratu Muleta",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Paid'
    },
    {
        id: "ID007",
        fullName: "Megersa Biratu Muleta",
        Sex: "Male",
        DateOfBirth: "oct-09-1999",
        DateOfRegistration: "Jan-01-2025",
        SelectedPlan: '3-Month',
        NextPaymentDate: 'Mar-01-2025',
        Status: 'Not Paid'
    },
]

export function CustomersTable() {
    const [filter, setFilter] = useState('All');
    const handleFilterChange = (status: string) => {
        setFilter(status);
    };

    const filteredInvoices = invoices.filter((invoice) => {
        if (filter === 'All') return true;
        return invoice.Status.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
                <TableCaption>A list of your recent customers.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Date of Registration</TableHead>
                        <TableHead>Selected Plan</TableHead>
                        <TableHead>Next Payment Date</TableHead>
                        <TableHead className="text-right">
                            Status
                            <select
                                className="border rounded-md px-2 py-1 text-sm ml-2"
                                value={filter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Paid">Paid</option>
                                <option value="Not Paid">Not Paid</option>
                            </select>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.fullName}</TableCell>
                            <TableCell>{invoice.DateOfRegistration}</TableCell>
                            <TableCell>{invoice.SelectedPlan}</TableCell>
                            <TableCell>{invoice.NextPaymentDate}</TableCell>
                            <TableCell
                                className={`${
                                    invoice.Status === 'Paid' ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                {invoice.Status}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    {/* Footer section can be added here if needed */}
                </TableFooter>
            </Table>
        </div>
    );
}


