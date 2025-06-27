import dbConnect from '@/lib/dbConnect';
import Employee from '@/models/Employee'
import Admin from '@/models/admin'

export async function POST(request) {
  await dbConnect()
  
  const { email, password, role } = await request.json()
  
  try {
    if (role === 'admin') {
      // Admin login logic
      const admin = await Admin.findOne({ username: email })
      
      if (!admin) {
        return Response.json(
          { success: false, message: 'Admin not found' },
          { status: 401 }
        )
      }
      
      const isMatch = password === admin.password // In production, use bcrypt compare
      
      if (!isMatch) {
        return Response.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
      
      return Response.json({
        success: true,
        role: admin.role === 'superadmin' ? 'Admin' : 'Manager',
        user: {
          id: admin._id,
          email: admin.username,
          role: admin.role,
          name: 'Admin User'
        }
      })
    } else {
      // Employee login logic
      const employee = await Employee.findOne({ email })
      
      if (!employee) {
        return Response.json(
          { success: false, message: 'Employee not found' },
          { status: 401 }
        )
      }
      
      const isMatch = password === employee.password // In production, use bcrypt compare
      
      if (!isMatch) {
        return Response.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
      
      // Update last login
      await Employee.findByIdAndUpdate(employee._id, { lastLogin: new Date() })
      
      return Response.json({
        success: true,
        role: employee.role,
        user: {
          id: employee._id,
          email: employee.email,
          role: employee.role,
          name: employee.name,
          permissions: employee.permissions
        }
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}