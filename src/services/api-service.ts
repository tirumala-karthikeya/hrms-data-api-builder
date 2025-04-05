
import { ApiEndpoint, ApiRequestOptions, ApiResponse } from "../types/api";

const API_KEY = "xpectrum_api_key_123@ai";
const BASE_URL = "https://hrms-api.xpectrum-ai.com";

export const fetchApi = async (options: ApiRequestOptions): Promise<ApiResponse> => {
  const { url, method, headers = {}, params = {}, data } = options;
  
  // Add API key to params
  const queryParams = new URLSearchParams({ ...params, api_key: API_KEY });
  
  // Build the full URL
  const fullUrl = `${url}${url.includes('?') ? '&' : '?'}${queryParams}`;
  
  const startTime = performance.now();
  
  try {
    const requestHeaders: HeadersInit = {
      ...headers,
      'Content-Type': 'application/json',
      'api_key': API_KEY
    };
    
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(fullUrl, requestOptions);
    const responseData = await response.json();
    const endTime = performance.now();
    
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: responseHeaders,
      time: endTime - startTime
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 0,
      statusText: 'Network Error',
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      headers: {},
      time: endTime - startTime
    };
  }
};

export const apiEndpoints: ApiEndpoint[] = [
  // Employee Data endpoints
  {
    id: 'get-employee',
    name: 'Get Employee Data',
    url: `${BASE_URL}/hrms/api/v1/employee_data/{employee_id}`,
    method: 'GET',
    description: 'Retrieve data for a specific employee by ID',
    category: 'Employee Data',
    requiresId: true
  },
  {
    id: 'get-all-employees',
    name: 'Get All Employees',
    url: `${BASE_URL}/hrms/api/v1/all_employee_data`,
    method: 'GET',
    description: 'Retrieve data for all employees',
    category: 'Employee Data'
  },
  {
    id: 'create-employee',
    name: 'Create Employee',
    url: `${BASE_URL}/hrms/api/v1/employee_data`,
    method: 'POST',
    description: 'Create a new employee record',
    category: 'Employee Data',
    hasBody: true
  },
  {
    id: 'update-employee',
    name: 'Update Employee',
    url: `${BASE_URL}/hrms/api/v1/employee_data/{employee_id}`,
    method: 'PUT',
    description: 'Update an existing employee record',
    category: 'Employee Data',
    requiresId: true,
    hasBody: true
  },
  {
    id: 'delete-employee',
    name: 'Delete Employee',
    url: `${BASE_URL}/hrms/api/v1/employee_data/{employee_id}`,
    method: 'DELETE',
    description: 'Delete an employee record',
    category: 'Employee Data',
    requiresId: true
  },
  
  // Insurance Data endpoints
  {
    id: 'get-employee-insurance',
    name: 'Get Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data/{employee_id}`,
    method: 'GET',
    description: 'Retrieve insurance data for a specific employee',
    category: 'Insurance',
    requiresId: true
  },
  {
    id: 'create-employee-insurance',
    name: 'Create Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data`,
    method: 'POST',
    description: 'Create insurance data for an employee',
    category: 'Insurance',
    hasBody: true
  },
  {
    id: 'update-employee-insurance',
    name: 'Update Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data/{employee_id}`,
    method: 'PUT',
    description: 'Update insurance data for an employee',
    category: 'Insurance',
    requiresId: true,
    hasBody: true
  },
  {
    id: 'delete-employee-insurance',
    name: 'Delete Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data/{employee_id}`,
    method: 'DELETE',
    description: 'Delete insurance data for an employee',
    category: 'Insurance',
    requiresId: true
  },
  
  // Harassment Reports
  {
    id: 'get-harassment-report',
    name: 'Get Harassment Report',
    url: `${BASE_URL}/hrms/api/v1/harassment_reports/{complaint_id}`,
    method: 'GET',
    description: 'Retrieve a specific harassment report',
    category: 'Harassment Reports',
    requiresId: true
  },
  {
    id: 'create-harassment-report',
    name: 'Create Harassment Report',
    url: `${BASE_URL}/hrms/api/v1/harassment_reports`,
    method: 'POST',
    description: 'Create a new harassment report',
    category: 'Harassment Reports',
    hasBody: true
  },
  {
    id: 'delete-harassment-report',
    name: 'Delete Harassment Report',
    url: `${BASE_URL}/hrms/api/v1/harassment_reports/{complaint_id}`,
    method: 'DELETE',
    description: 'Delete a harassment report',
    category: 'Harassment Reports',
    requiresId: true
  },
  
  // Insurance Plans
  {
    id: 'get-insurance-plan',
    name: 'Get Insurance Plan',
    url: `${BASE_URL}/hrms/api/v1/insurance_plan/{plan_name}`,
    method: 'GET',
    description: 'Retrieve a specific insurance plan',
    category: 'Insurance',
    requiresId: true
  },
  {
    id: 'update-insurance-plan',
    name: 'Update Insurance Plan',
    url: `${BASE_URL}/hrms/api/v1/insurance_plan/{plan_name}`,
    method: 'PUT',
    description: 'Update an insurance plan',
    category: 'Insurance',
    requiresId: true,
    hasBody: true
  },
  
  // Leave Balance
  {
    id: 'get-leave-balance',
    name: 'Get Leave Balance',
    url: `${BASE_URL}/hrms/api/v1/leave_balance_data/{employee_id}`,
    method: 'GET',
    description: 'Retrieve leave balance for an employee',
    category: 'Leave Management',
    requiresId: true
  },
  {
    id: 'update-leave-balance',
    name: 'Update Leave Balance',
    url: `${BASE_URL}/hrms/api/v1/leave_balance_data/{employee_id}`,
    method: 'PUT',
    description: 'Update leave balance for an employee',
    category: 'Leave Management',
    requiresId: true,
    hasBody: true
  },
  
  // Leave Requests
  {
    id: 'get-leave-request',
    name: 'Get Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests/{application_id}`,
    method: 'GET',
    description: 'Retrieve a specific leave request',
    category: 'Leave Management',
    requiresId: true
  },
  {
    id: 'create-leave-request',
    name: 'Create Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests`,
    method: 'POST',
    description: 'Create a new leave request',
    category: 'Leave Management',
    hasBody: true
  },
  {
    id: 'update-leave-request',
    name: 'Update Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests/{application_id}`,
    method: 'PUT',
    description: 'Update an existing leave request',
    category: 'Leave Management',
    requiresId: true,
    hasBody: true
  },
  {
    id: 'delete-leave-request',
    name: 'Delete Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests/{application_id}`,
    method: 'DELETE',
    description: 'Delete a leave request',
    category: 'Leave Management',
    requiresId: true
  },
  
  // Payroll
  {
    id: 'get-payroll',
    name: 'Get Payroll',
    url: `${BASE_URL}/hrms/api/v1/payroll/{employee_id}`,
    method: 'GET',
    description: 'Retrieve payroll data for an employee',
    category: 'Payroll',
    requiresId: true
  },
  
  // Salary Info
  {
    id: 'get-salary-info',
    name: 'Get Salary Info',
    url: `${BASE_URL}/hrms/api/v1/salary_info/{employee_id}`,
    method: 'GET',
    description: 'Retrieve salary information for an employee',
    category: 'Payroll',
    requiresId: true
  },
  
  // Taxes
  {
    id: 'get-all-taxes',
    name: 'Get All Taxes',
    url: `${BASE_URL}/hrms/api/v1/all_taxes`,
    method: 'GET',
    description: 'Retrieve all tax information',
    category: 'Payroll'
  },
  
  // Company Policies
  {
    id: 'get-sexual-harassment-policy',
    name: 'Get Sexual Harassment Policy',
    url: `${BASE_URL}/hrms/api/v1/company_policies/Prevention_of_Sexual_Harassment_Policy`,
    method: 'GET',
    description: 'Retrieve sexual harassment prevention policy',
    category: 'Policies'
  },
  {
    id: 'get-hr-complaint-policy',
    name: 'Get HR Complaint Policy',
    url: `${BASE_URL}/hrms/api/v1/company_policies/General_HR_Complaint_Policy`,
    method: 'GET',
    description: 'Retrieve HR complaint policy',
    category: 'Policies'
  },
  {
    id: 'get-leave-policy',
    name: 'Get Leave Policy',
    url: `${BASE_URL}/hrms/api/v1/company_policies/Leave_Policy`,
    method: 'GET',
    description: 'Retrieve leave policy',
    category: 'Policies'
  }
];
