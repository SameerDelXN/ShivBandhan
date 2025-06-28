// app/api/employees/[id]/route.js
import { NextResponse } from 'next/server';
import Employee from '@/models/Employee';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const employee = await Employee.findById(params.id);

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const {
      name,
      username,
      email,
      phone,
      role,
      status,
      permissions,
      department,
      position
    } = await request.json();

    // Check if employee exists
    const existingEmployee = await Employee.findById(params.id);
    if (!existingEmployee) {
      return NextResponse.json(
        { success: false, message: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if username or email is being changed to an existing one
    if (username !== existingEmployee.username) {
      const usernameExists = await Employee.findOne({ username });
      if (usernameExists) {
        return NextResponse.json(
          { success: false, message: 'Username already exists' },
          { status: 400 }
        );
      }
    }

    if (email !== existingEmployee.email) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      params.id,
      {
        name,
        username,
        email,
        phone,
        role,
        status,
        permissions,
        department,
        position,
        lastLogin: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedEmployee });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(params.id);

    if (!deletedEmployee) {
      return NextResponse.json(
        { success: false, message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}