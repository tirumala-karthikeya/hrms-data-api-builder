import { ApiEndpoint, ApiRequestOptions, ApiResponse, EmployeeData } from "../types/api";

const API_KEY = "xpectrum_api_key_123@ai";
const BASE_URL = "https://hrms-api.xpectrum-ai.com";

export const fetchApi = async (options: ApiRequestOptions): Promise<ApiResponse> => {
  const { url, method, headers = {}, params = {}, data } = options;
  
  const queryParams = new URLSearchParams({ ...params, api_key: API_KEY });
  
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

const employeeExample: EmployeeData = {
  employee_id: "EM3278888",
  first_name: "Mark",
  last_name: "Figueroa",
  email: "jeffreydoyle@example.net",
  phone_number: "001-581-896-0013x3890",
  hire_date: "2021-02-19",
  job_title: "Theme park manager",
  job_id: 284,
  gov_id: "829-01-2616",
  hiring_manager_id: "E001",
  hr_manager_id: "E009",
  marital_status: "single",
  state: "California",
  emergency_contact_name: "Gina Moore",
  emergency_contact_phone: "001-851-316-1559x40781",
  sex: "Male",
  department: "Carter, Fuller and Mcclure",
  date_of_birth: "1978-12-26",
  status: "Active"
};

const employeeInsuranceExample = {
  employee_id: "EM3278888",
  plan_name: "Gold Health Plan",
  insurance_plan_id: "INS-2023-GOLD",
  enrollment_date: "2022-01-15",
  coverage_type: "Family",
  employee_contribution: 150.75,
  enrollment_time: "09:30:00"
};

const harassmentReportExample = {
  complaint_id: 1001,
  victim_employee_id: 1234,
  harasser_employee_id: 5678,
  harassment_level: "Severe",
  description: "Inappropriate comments were made during team meeting",
  status: "Under Review",
  review_body: "HR is currently investigating the complaint",
  incident_date: "2023-06-15",
  incident_time: "14:30:00",
  reported_date: "2023-06-16",
  reported_time: "09:15:00",
  level: "High"
};

const leaveRequestExample = {
  employee_id: "EM3278888",
  application_id: 2001,
  start_date: "2023-07-10",
  total_working_days_off: 5,
  total_days_off: 7,
  end_date: "2023-07-16",
  deduction_from_salary: 0,
  leave_type: "Annual Leave",
  reason: "Family vacation",
  request_date: "2023-06-20",
  request_time: "10:45:00",
  reviewed_by: "E009",
  status: "Approved",
  approved_by: "E001"
};

const insurancePlanExample = {
  plan_name: "Gold Health Plan",
  plan_id: "INS-2023-GOLD",
  network: "PPO",
  deductible_individual_family: "$500/$1000",
  out_of_pocket_maximum_individual_family: "$2000/$4000",
  coinsurance: "20%",
  overall_lifetime_maximum: "Unlimited",
  rates_premium_employee_only: 300,
  rates_premium_employer_contribution_employee_only: 250,
  rates_premium_employee_contribution_employee_only: 50,
  rates_premium_employee_spouse: 600,
  rates_premium_employer_contribution_employee_spouse: 450,
  rates_premium_employee_contribution_employee_spouse: 150,
  rates_premium_employee_children: 500,
  rates_premium_employer_contribution_employee_children: 400,
  rates_premium_employee_contribution_employee_children: 100,
  rates_premium_family: 800,
  rates_premium_employer_contribution_family: 600,
  rates_premium_employee_contribution_family: 200
};

const leaveBalanceExample = {
  employee_id: "EM3278888",
  annual_leave_balance: 15,
  sick_leave_balance: 10,
  personal_leave_balance: 3,
  unpaid_leave_taken: 0,
  leave_balance_updated_date: "2023-05-01"
};

const payrollExample = {
  employee_id: "EM3278888",
  base_salary: 5000.00,
  federal_tax: 750.00,
  state_tax: 250.00,
  total_tax: 1000.00,
  month: "June 2023",
  salary_received_day: "2023-06-30"
};

const salaryInfoExample = {
  employee_id: "EM3278888",
  base_salary: 60000.00,
  salary_type: "Annual",
  bonus: 5000.00,
  commission: 0.00,
  currency: "USD",
  salary_grade: "G3",
  last_salary_increase_date: "2023-01-01"
};

const allEmployeesResponse = {
  status: "success",
  data: {
    employees: [employeeExample, { ...employeeExample, employee_id: "EM3278889" }]
  }
};

const policyExample = {
  title: "Prevention of Sexual Harassment Policy",
  content: "This policy outlines the company's commitment to providing a workplace free from sexual harassment..."
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
    requiresId: true,
    exampleResponse: {
      status: "success", 
      data: employeeExample
    }
  },
  {
    id: 'get-all-employees',
    name: 'Get All Employees',
    url: `${BASE_URL}/hrms/api/v1/all_employee_data`,
    method: 'GET',
    description: 'Retrieve data for all employees',
    category: 'Employee Data',
    exampleResponse: allEmployeesResponse
  },
  {
    id: 'create-employee',
    name: 'Create Employee',
    url: `${BASE_URL}/hrms/api/v1/employee_data`,
    method: 'POST',
    description: 'Create a new employee record',
    category: 'Employee Data',
    hasBody: true,
    exampleRequestBody: employeeExample,
    exampleResponse: {
      status: "success",
      message: "Employee created successfully",
      data: { employee_id: "EM3278888" }
    }
  },
  {
    id: 'update-employee',
    name: 'Update Employee',
    url: `${BASE_URL}/hrms/api/v1/employee_data/{employee_id}`,
    method: 'PUT',
    description: 'Update an existing employee record',
    category: 'Employee Data',
    requiresId: true,
    hasBody: true,
    exampleRequestBody: employeeExample,
    exampleResponse: {
      status: "success",
      message: "Employee updated successfully",
      data: { employee_id: "EM3278888" }
    }
  },
  {
    id: 'delete-employee',
    name: 'Delete Employee',
    url: `${BASE_URL}/hrms/api/v1/employee_data/{employee_id}`,
    method: 'DELETE',
    description: 'Delete an employee record',
    category: 'Employee Data',
    requiresId: true,
    exampleResponse: {
      status: "success",
      message: "Employee deleted successfully"
    }
  },
  
  // Insurance Data endpoints
  {
    id: 'get-employee-insurance',
    name: 'Get Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data/{employee_id}`,
    method: 'GET',
    description: 'Retrieve insurance data for a specific employee',
    category: 'Insurance',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: employeeInsuranceExample
    }
  },
  {
    id: 'create-employee-insurance',
    name: 'Create Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data`,
    method: 'POST',
    description: 'Create insurance data for an employee',
    category: 'Insurance',
    hasBody: true,
    exampleRequestBody: employeeInsuranceExample,
    exampleResponse: {
      status: "success",
      message: "Insurance data created successfully",
      data: { employee_id: "EM3278888" }
    }
  },
  {
    id: 'update-employee-insurance',
    name: 'Update Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data/{employee_id}`,
    method: 'PUT',
    description: 'Update insurance data for an employee',
    category: 'Insurance',
    requiresId: true,
    hasBody: true,
    exampleRequestBody: employeeInsuranceExample,
    exampleResponse: {
      status: "success",
      message: "Insurance data updated successfully",
      data: { employee_id: "EM3278888" }
    }
  },
  {
    id: 'delete-employee-insurance',
    name: 'Delete Employee Insurance',
    url: `${BASE_URL}/hrms/api/v1/employee_insurance_data/{employee_id}`,
    method: 'DELETE',
    description: 'Delete insurance data for an employee',
    category: 'Insurance',
    requiresId: true,
    exampleResponse: {
      status: "success",
      message: "Insurance data deleted successfully"
    }
  },
  
  // Harassment Reports
  {
    id: 'get-harassment-report',
    name: 'Get Harassment Report',
    url: `${BASE_URL}/hrms/api/v1/harassment_reports/{complaint_id}`,
    method: 'GET',
    description: 'Retrieve a specific harassment report',
    category: 'Harassment Reports',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: harassmentReportExample
    }
  },
  {
    id: 'create-harassment-report',
    name: 'Create Harassment Report',
    url: `${BASE_URL}/hrms/api/v1/harassment_reports`,
    method: 'POST',
    description: 'Create a new harassment report',
    category: 'Harassment Reports',
    hasBody: true,
    exampleRequestBody: harassmentReportExample,
    exampleResponse: {
      status: "success",
      message: "Harassment report created successfully",
      data: { complaint_id: 1001 }
    }
  },
  {
    id: 'delete-harassment-report',
    name: 'Delete Harassment Report',
    url: `${BASE_URL}/hrms/api/v1/harassment_reports/{complaint_id}`,
    method: 'DELETE',
    description: 'Delete a harassment report',
    category: 'Harassment Reports',
    requiresId: true,
    exampleResponse: {
      status: "success",
      message: "Harassment report deleted successfully"
    }
  },
  
  // Insurance Plans
  {
    id: 'get-insurance-plan',
    name: 'Get Insurance Plan',
    url: `${BASE_URL}/hrms/api/v1/insurance_plan/{plan_name}`,
    method: 'GET',
    description: 'Retrieve a specific insurance plan',
    category: 'Insurance',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: insurancePlanExample
    }
  },
  {
    id: 'update-insurance-plan',
    name: 'Update Insurance Plan',
    url: `${BASE_URL}/hrms/api/v1/insurance_plan/{plan_name}`,
    method: 'PUT',
    description: 'Update an insurance plan',
    category: 'Insurance',
    requiresId: true,
    hasBody: true,
    exampleRequestBody: insurancePlanExample,
    exampleResponse: {
      status: "success",
      message: "Insurance plan updated successfully",
      data: { plan_name: "Gold Health Plan" }
    }
  },
  
  // Leave Balance
  {
    id: 'get-leave-balance',
    name: 'Get Leave Balance',
    url: `${BASE_URL}/hrms/api/v1/leave_balance_data/{employee_id}`,
    method: 'GET',
    description: 'Retrieve leave balance for an employee',
    category: 'Leave Management',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: leaveBalanceExample
    }
  },
  {
    id: 'update-leave-balance',
    name: 'Update Leave Balance',
    url: `${BASE_URL}/hrms/api/v1/leave_balance_data/{employee_id}`,
    method: 'PUT',
    description: 'Update leave balance for an employee',
    category: 'Leave Management',
    requiresId: true,
    hasBody: true,
    exampleRequestBody: leaveBalanceExample,
    exampleResponse: {
      status: "success",
      message: "Leave balance updated successfully",
      data: { employee_id: "EM3278888" }
    }
  },
  
  // Leave Requests
  {
    id: 'get-leave-request',
    name: 'Get Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests/{application_id}`,
    method: 'GET',
    description: 'Retrieve a specific leave request',
    category: 'Leave Management',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: leaveRequestExample
    }
  },
  {
    id: 'create-leave-request',
    name: 'Create Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests`,
    method: 'POST',
    description: 'Create a new leave request',
    category: 'Leave Management',
    hasBody: true,
    exampleRequestBody: leaveRequestExample,
    exampleResponse: {
      status: "success",
      message: "Leave request created successfully",
      data: { application_id: 2001 }
    }
  },
  {
    id: 'update-leave-request',
    name: 'Update Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests/{application_id}`,
    method: 'PUT',
    description: 'Update an existing leave request',
    category: 'Leave Management',
    requiresId: true,
    hasBody: true,
    exampleRequestBody: leaveRequestExample,
    exampleResponse: {
      status: "success",
      message: "Leave request updated successfully",
      data: { application_id: 2001 }
    }
  },
  {
    id: 'delete-leave-request',
    name: 'Delete Leave Request',
    url: `${BASE_URL}/hrms/api/v1/leave_requests/{application_id}`,
    method: 'DELETE',
    description: 'Delete a leave request',
    category: 'Leave Management',
    requiresId: true,
    exampleResponse: {
      status: "success",
      message: "Leave request deleted successfully"
    }
  },
  
  // Payroll
  {
    id: 'get-payroll',
    name: 'Get Payroll',
    url: `${BASE_URL}/hrms/api/v1/payroll/{employee_id}`,
    method: 'GET',
    description: 'Retrieve payroll data for an employee',
    category: 'Payroll',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: payrollExample
    }
  },
  
  // Salary Info
  {
    id: 'get-salary-info',
    name: 'Get Salary Info',
    url: `${BASE_URL}/hrms/api/v1/salary_info/{employee_id}`,
    method: 'GET',
    description: 'Retrieve salary information for an employee',
    category: 'Payroll',
    requiresId: true,
    exampleResponse: {
      status: "success",
      data: salaryInfoExample
    }
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
    category: 'Policies',
    exampleResponse: {
      status: "success",
      data: policyExample
    }
  },
  {
    id: 'get-hr-complaint-policy',
    name: 'Get HR Complaint Policy',
    url: `${BASE_URL}/hrms/api/v1/company_policies/General_HR_Complaint_Policy`,
    method: 'GET',
    description: 'Retrieve HR complaint policy',
    category: 'Policies',
    exampleResponse: {
      status: "success",
      data: policyExample
    }
  },
  {
    id: 'get-leave-policy',
    name: 'Get Leave Policy',
    url: `${BASE_URL}/hrms/api/v1/company_policies/Leave_Policy`,
    method: 'GET',
    description: 'Retrieve leave policy',
    category: 'Policies',
    exampleResponse: {
      status: "success",
      data: policyExample
    }
  }
];
